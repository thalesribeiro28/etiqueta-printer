import React, { useState } from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import FileUploader from './components/FileUploader';
import LabelEditor from './components/LabelEditor';
import LabelPreview from './components/LabelPreview';
import { LabelTemplate } from './types';
import mazarroLogo from './assets/mazarro.png';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [template, setTemplate] = useState<LabelTemplate>({
    width: 50, // largura padrão em mm
    height: 30, // altura padrão em mm
    codigo: { x: 10, y: 10, fontSize: 12 },
    produto: { x: 10, y: 30, fontSize: 14 },
    valor: { x: 10, y: 50, fontSize: 12 }
  });

  const handleSaveTemplate = () => {
    const templateString = JSON.stringify(template, null, 2);
    const blob = new Blob([templateString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-etiqueta.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedTemplate = JSON.parse(e.target?.result as string) as LabelTemplate;
          setTemplate(loadedTemplate);
        } catch (error) {
          console.error('Erro ao carregar template:', error);
          alert('Erro ao carregar o arquivo de template. Verifique se é um arquivo JSON válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={mazarroLogo} alt="Mazarro Logo" style={{ height: '50px' }} />
            <Typography variant="h4" component="h1">
              Gerador de Etiquetas
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            alignItems: 'center'
          }}>
            <Button
              variant="contained"
              component="label"
              color="primary"
            >
              Carregar Template
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleLoadTemplate}
              />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSaveTemplate}
            >
              Salvar Template
            </Button>
          </Box>
        </Box>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <FileUploader onDataLoaded={setData} />
        </Paper>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Paper sx={{ p: 3, flex: 1 }}>
            <LabelEditor template={template} onTemplateChange={setTemplate} />
          </Paper>
          
          <Paper sx={{ p: 3, flex: 1 }}>
            <LabelPreview 
              data={data} 
              template={template} 
              onTemplateChange={setTemplate}
            />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
