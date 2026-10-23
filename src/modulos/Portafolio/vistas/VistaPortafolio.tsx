import React, { useEffect, useState } from 'react';
import {
  FolderTree,
  Cpu,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Briefcase,
  Code2,
  GraduationCap,
  Server,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { obtenerDatosPortafolio } from '../servicios/servicioPortafolio';
import { PerfilIngeniero } from '../interfaces/portafolio';
import { TarjetaDemoModulo } from '../componentes/TarjetaDemoModulo';
import { restaurarTemaPorDefecto } from '../../General/utilidades/aplicarTemaCliente';
import { actualizarMetadatosSEO } from '../../General/utilidades/actualizarMetadatosSEO';

/**
 * Vista principal del Portafolio Profesional de Samuel Edgar Pacheco Velin
 * y Centro de Demostraciones Interactivas (Apps White-Label & NFC).
 */
export const VistaPortafolio: React.FC = () => {
  const [datosPortafolio] = useState<PerfilIngeniero>(() =>
    obtenerDatosPortafolio()
  );

  useEffect(() => {
    restaurarTemaPorDefecto();
    actualizarMetadatosSEO({
      tituloPagina: `${datosPortafolio.nombreCompleto} · Desarrollador Full-Stack, React, Spring Boot & Sage X3`,
      descripcionMeta: datosPortafolio.propuestaValor
    });
  }, [datosPortafolio]);

  return (
    <div className="min-h-screen bg-lienzo text-tinta">
      {/* 1. Cabecera Profesional de Samuel Edgar Pacheco Velin */}
      <header className="bg-superficie border-b border-bordeSutil">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-lienzo border border-gray-300 rounded-sm text-xs font-mono text-tinta">
              <Cpu className="w-3.5 h-3.5 text-tinta" />
              <span>PORTAFOLIO DE INGENIERÍA DE SOFTWARE & DEMOS EN VIVO</span>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-tintaSuave">
              <MapPin className="w-3.5 h-3.5 text-tinta" />
              {datosPortafolio.ubicacion}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-tinta">
              {datosPortafolio.nombreCompleto}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-tintaSuave">
              {datosPortafolio.rolEspecialidad}
            </p>
            <p className="text-sm text-tintaSuave pt-2 max-w-3xl leading-relaxed">
              {datosPortafolio.propuestaValor}
            </p>
          </div>

          {/* Botones de Contacto Directo y Redes Profesionales */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <a
              href={datosPortafolio.urlGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-tinta text-white text-xs font-mono font-semibold rounded-sm hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub (@{datosPortafolio.usuarioGithub})</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </a>

            <a
              href={datosPortafolio.urlLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-superficie text-tinta border border-gray-300 text-xs font-mono font-semibold rounded-sm hover:border-tinta transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-tintaSuave" />
            </a>

            <a
              href={`mailto:${datosPortafolio.emailContacto}`}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-lienzo text-tinta border border-gray-300 text-xs font-mono rounded-sm hover:border-tinta transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{datosPortafolio.emailContacto}</span>
            </a>

            <a
              href={`tel:${datosPortafolio.telefonoContacto.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-lienzo text-tinta border border-gray-300 text-xs font-mono rounded-sm hover:border-tinta transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{datosPortafolio.telefonoContacto}</span>
            </a>
          </div>

          {/* Pilares de Trabajo */}
          <div className="pt-6 border-t border-bordeSutil grid grid-cols-1 md:grid-cols-3 gap-4">
            {datosPortafolio.pilaresArquitectura.map((pilar, indice) => (
              <div
                key={indice}
                className="bg-lienzo border border-bordeSutil rounded-sm p-4"
              >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-tintaSuave">
                  <ShieldCheck className="w-4 h-4 text-tinta" />
                  <span>Enfoque 0{indice + 1}</span>
                </div>
                <h2 className="text-sm font-bold text-tinta mt-2">
                  {pilar.titulo}
                </h2>
                <p className="text-xs text-tintaSuave mt-1 leading-relaxed">
                  {pilar.explicacion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* 2. Sobre Mí / Carta de Presentación y Stack Tecnológico */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Carta de Presentación (7 columnas) */}
          <div className="lg:col-span-7 bg-superficie border border-bordeSutil rounded-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-bordeSutil pb-3">
              <Terminal className="w-4 h-4 text-tinta" />
              <h2 className="text-lg font-bold text-tinta">
                Sobre Mí & Perfil Técnico
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-tinta leading-relaxed">
              {datosPortafolio.cartaPresentacionParrafos.map((parrafo, idx) => (
                <p key={idx}>{parrafo}</p>
              ))}
            </div>
          </div>

          {/* Habilidades Técnicas por Área (5 columnas) */}
          <div className="lg:col-span-5 bg-superficie border border-bordeSutil rounded-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-bordeSutil pb-3">
              <Code2 className="w-4 h-4 text-tinta" />
              <h2 className="text-lg font-bold text-tinta">
                Stack Tecnológico
              </h2>
            </div>

            <div className="space-y-3.5">
              {datosPortafolio.categoriasHabilidades.map((grupo) => (
                <div key={grupo.area} className="space-y-1.5">
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-tintaSuave font-semibold">
                    {grupo.area}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {grupo.habilidades.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-lienzo border border-gray-300 rounded-sm text-xs font-mono text-tinta"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Experiencia Profesional en Consultoría y Desarrollo */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-bordeSutil">
            <Briefcase className="w-5 h-5 text-tinta" />
            <h2 className="text-xl sm:text-2xl font-bold text-tinta">
              Experiencia Laboral en Desarrollo & Consultoría
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {datosPortafolio.experienciaLaboral.map((exp, idx) => (
              <article
                key={idx}
                className="bg-superficie border border-bordeSutil rounded-sm p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-bordeSutil pb-3">
                    <div>
                      <h3 className="text-base font-bold text-tinta">
                        {exp.puesto}
                      </h3>
                      <p className="text-xs font-semibold text-tintaSuave">
                        {exp.empresa} · {exp.ubicacion}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-lienzo border border-gray-300 rounded-sm text-[11px] font-mono text-tinta">
                      {exp.periodo}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-tinta leading-relaxed list-disc pl-4">
                    {exp.logros.map((logro, i) => (
                      <li key={i}>{logro}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-bordeSutil flex flex-wrap gap-1.5">
                  {exp.tecnologiasClave.map((tec) => (
                    <span
                      key={tec}
                      className="px-2 py-0.5 bg-lienzo border border-gray-300 rounded-sm text-[10px] font-mono text-tintaSuave"
                    >
                      {tec}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Proyectos de Ingeniería, Automatización y Homelab */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-bordeSutil">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-tinta" />
              <h2 className="text-xl sm:text-2xl font-bold text-tinta">
                Proyectos Propios, Automatización & Homelab DevOps
              </h2>
            </div>
            <a
              href={datosPortafolio.urlGithub}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-tinta hover:underline inline-flex items-center gap-1"
            >
              <span>Ver repositorios en github.com/{datosPortafolio.usuarioGithub}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {datosPortafolio.proyectosIngenieria.map((proyecto, idx) => (
              <article
                key={idx}
                className="bg-superficie border border-bordeSutil rounded-sm p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-tintaSuave">
                    {proyecto.subtitulo}
                  </span>
                  <h3 className="text-base font-bold text-tinta mt-1">
                    {proyecto.titulo}
                  </h3>
                  <p className="text-xs text-tintaSuave mt-2 leading-relaxed">
                    {proyecto.descripcion}
                  </p>
                </div>

                <div className="pt-3 border-t border-bordeSutil flex flex-wrap gap-1.5">
                  {proyecto.tecnologias.map((tec) => (
                    <span
                      key={tec}
                      className="px-2 py-0.5 bg-lienzo border border-gray-300 rounded-sm text-[10px] font-mono text-tinta"
                    >
                      {tec}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Formación Académica */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-bordeSutil">
            <GraduationCap className="w-5 h-5 text-tinta" />
            <h2 className="text-xl font-bold text-tinta">
              Formación Académica y Certificaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {datosPortafolio.formacionAcademica.map((item, idx) => (
              <div
                key={idx}
                className="bg-superficie border border-bordeSutil rounded-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-mono text-tintaSuave">
                    {item.periodo}
                  </span>
                  <h3 className="text-sm font-bold text-tinta mt-1">
                    {item.titulacion}
                  </h3>
                </div>
                <p className="text-xs text-tintaSuave mt-3 pt-2 border-t border-gray-100">
                  {item.centro}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Demostraciones Interactivas en Vivo (Apps Comerciales & NFC) */}
        <section className="space-y-6 pt-4 border-t border-bordeSutil">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-tintaSuave">
                Aplicaciones Interactivas Desplegadas en Esta SPA
              </span>
              <h2 className="text-2xl font-bold text-tinta mt-1">
                Prototipos Comerciales en Vivo (NFC & Impresión 3D)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-tintaSuave bg-superficie border border-bordeSutil px-3 py-1.5 rounded-sm self-start sm:self-auto">
              <FolderTree className="w-4 h-4 text-tinta" />
              <span>src/modulos/[Dominio]</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {datosPortafolio.demosDisponibles.map((demo) => (
              <TarjetaDemoModulo key={demo.id} demo={demo} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
