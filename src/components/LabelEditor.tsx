import React from 'react';
import { Box, Typography, Slider, FormControl, InputLabel, TextField, Divider } from '@mui/material';
import { LabelTemplate } from '../types';

interface LabelEditorProps {
  template: LabelTemplate;
  onTemplateChange: (template: LabelTemplate) => void;
}

const LabelEditor: React.FC<LabelEditorProps> = ({ template, onTemplateChange }) => {
  const handleFontSizeChange = (field: keyof Omit<LabelTemplate, 'width' | 'height'>) => (_: Event, value: number | number[]) => {
    const newTemplate = { ...template };
    newTemplate[field] = {
      ...newTemplate[field],
      fontSize: value as number
    };
    onTemplateChange(newTemplate);
  };

  const handleDimensionChange = (dimension: 'width' | 'height') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0) {
      const newTemplate = { ...template };
      newTemplate[dimension] = value;
      onTemplateChange(newTemplate);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Dimensões da Etiqueta
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Largura (mm)"
          type="number"
          value={template.width}
          onChange={handleDimensionChange('width')}
          inputProps={{ min: 1, step: 1 }}
          size="small"
        />
        <TextField
          label="Altura (mm)"
          type="number"
          value={template.height}
          onChange={handleDimensionChange('height')}
          inputProps={{ min: 1, step: 1 }}
          size="small"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Tamanho da Fonte
      </Typography>

      {(['codigo', 'produto', 'valor'] as const).map((field) => (
        <Box key={field} sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor={`${field}-font-size`} sx={{ transform: 'none', position: 'relative' }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </InputLabel>
            <Slider
              id={`${field}-font-size`}
              value={template[field].fontSize}
              onChange={handleFontSizeChange(field)}
              min={6}
              max={72}
              step={1}
              valueLabelDisplay="auto"
              sx={{ mt: 2 }}
            />
          </FormControl>
        </Box>
      ))}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Arraste os campos da tabela para a etiqueta para ajustar a posição
      </Typography>
    </Box>
  );
};

export default LabelEditor; 