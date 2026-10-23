/**
 * @file portafolio.ts
 * @description Interfaces de TypeScript para el Portafolio Profesional de Samuel Edgar Pacheco Velin
 * y el lanzador de demostraciones interactivas NFC.
 */

import { ColorHSLCliente } from '../../General/interfaces/configuracionBase';

export interface DemoComercialNFC {
  id: string;
  titulo: string;
  sectorNegocio: string;
  rutaDemo: string;
  urlEtiquetaNFC: string;
  resumenFuncional: string;
  caracteristicasClave: string[];
  colorMuestraHSL: ColorHSLCliente;
}

export interface ExperienciaLaboralItem {
  puesto: string;
  empresa: string;
  ubicacion: string;
  periodo: string;
  logros: string[];
  tecnologiasClave: string[];
}

export interface ProyectoIngenieriaItem {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  tecnologias: string[];
}

export interface FormacionAcademicaItem {
  titulacion: string;
  centro: string;
  periodo: string;
}

export interface CategoriaHabilidad {
  area: string;
  habilidades: string[];
}

export interface PerfilIngeniero {
  nombreCompleto: string;
  rolEspecialidad: string;
  ubicacion: string;
  emailContacto: string;
  telefonoContacto: string;
  urlGithub: string;
  usuarioGithub: string;
  urlLinkedin: string;
  propuestaValor: string;
  cartaPresentacionParrafos: string[];
  categoriasHabilidades: CategoriaHabilidad[];
  experienciaLaboral: ExperienciaLaboralItem[];
  proyectosIngenieria: ProyectoIngenieriaItem[];
  formacionAcademica: FormacionAcademicaItem[];
  pilaresArquitectura: {
    titulo: string;
    explicacion: string;
  }[];
  demosDisponibles: DemoComercialNFC[];
}
