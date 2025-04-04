export interface FieldPosition {
  x: number;
  y: number;
  fontSize: number;
}

export interface LabelTemplate {
  width: number; // largura em mm
  height: number; // altura em mm
  codigo: FieldPosition;
  produto: FieldPosition;
  valor: FieldPosition;
}

export interface LabelData {
  codigo: string;
  produto: string;
  valor: string;
} 