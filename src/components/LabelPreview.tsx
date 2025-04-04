import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LabelTemplate, LabelData } from '../types';
import mazarroLogo from '../assets/mazarro.png';

interface LabelPreviewProps {
  data: LabelData[];
  template: LabelTemplate;
  onTemplateChange: (template: LabelTemplate) => void;
}

interface DraggableFieldProps {
  field: keyof Omit<LabelTemplate, 'width' | 'height'>;
  value: string;
  position: { x: number; y: number };
  fontSize: number;
  onDrag: (field: keyof Omit<LabelTemplate, 'width' | 'height'>, x: number, y: number) => void;
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field, value, position, fontSize, onDrag }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && fieldRef.current) {
        const rect = fieldRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left - startPos.x;
          const y = e.clientY - rect.top - startPos.y;
          onDrag(field, x, y);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, field, onDrag, startPos]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (fieldRef.current) {
      const rect = fieldRef.current.getBoundingClientRect();
      setStartPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  return (
    <div
      ref={fieldRef}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: 'move',
        padding: '2px 4px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '2px',
        fontSize: `${fontSize}pt`,
        userSelect: 'none',
        zIndex: isDragging ? 1000 : 1,
        boxShadow: isDragging ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {value}
    </div>
  );
};

const LabelPreview: React.FC<LabelPreviewProps> = ({ data, template, onTemplateChange }) => {
  const [selectedItem, setSelectedItem] = useState<LabelData | null>(null);
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  const handleFieldDrag = (field: keyof Omit<LabelTemplate, 'width' | 'height'>, x: number, y: number) => {
    const xMm = Math.max(0, Math.min(template.width, x / 3.78));
    const yMm = Math.max(0, Math.min(template.height, y / 3.78));

    const newTemplate = { ...template };
    newTemplate[field] = {
      ...newTemplate[field],
      x: Math.round(xMm),
      y: Math.round(yMm),
    };
    onTemplateChange(newTemplate);
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @media print {
              @page {
                size: ${template.width}mm ${template.height}mm;
                margin: 0 !important;
                padding: 0 !important;
              }
              
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: ${template.width}mm !important;
                height: ${template.height}mm !important;
                box-sizing: border-box !important;
              }

              /* Remove cabeçalhos e rodapés da impressão */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }

            body {
              margin: 0;
              padding: 0;
              width: ${template.width}mm;
              height: ${template.height}mm;
              box-sizing: border-box;
            }

            .label-container {
              width: ${template.width}mm;
              height: ${template.height}mm;
              position: relative;
              page-break-after: always;
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              overflow: hidden;
            }

            .label-field {
              position: absolute;
              margin: 0;
              padding: 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          ${data.map(item => `
            <div class="label-container">
              ${(['codigo', 'produto', 'valor'] as const).map(field => `
                <div class="label-field" style="
                  left: ${template[field].x}mm;
                  top: ${template[field].y}mm;
                  font-size: ${template[field].fontSize}pt;
                ">
                  ${item[field] || ''}
                </div>
              `).join('')}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();

      setTimeout(() => {
        const win = iframe.contentWindow;
        if (win) {
          win.print();
        }
        document.body.removeChild(iframe);
      }, 250);
    }
  };

  // Converter mm para pixels para o preview
  const previewWidth = template.width * 3.78;
  const previewHeight = template.height * 3.78;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Prévia das Etiquetas
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={index}
                    onClick={() => setSelectedItem(item)}
                    selected={selectedItem === item}
                    sx={{ 
                      cursor: 'pointer', 
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      '&.Mui-selected': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <TableCell>{item.codigo}</TableCell>
                    <TableCell>{item.produto}</TableCell>
                    <TableCell>{item.valor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box
          sx={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            border: '2px solid #ccc',
            position: 'relative',
            backgroundColor: 'white',
            flexShrink: 0,
            margin: '0 auto',
          }}
        >
          {selectedItem && (
            <>
              {(['codigo', 'produto', 'valor'] as const).map((field) => (
                <DraggableField
                  key={field}
                  field={field}
                  value={selectedItem[field]}
                  position={{
                    x: template[field].x * 3.78,
                    y: template[field].y * 3.78
                  }}
                  fontSize={template[field].fontSize}
                  onDrag={handleFieldDrag}
                />
              ))}
            </>
          )}
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        disabled={data.length === 0}
        sx={{ mt: 2 }}
      >
        Imprimir Etiquetas
      </Button>
    </Box>
  );
};

export default LabelPreview; 