// Contratos revisados en routes/api.php, Controllers, Models, Data y config/module_permissions.php.
export type GestionCampo = { clave: string; obligatorio: boolean; tipo: string; maximo?: number; relacion?: string };
export type GestionConfig = { endpoint: string; permisos: Partial<Record<string, string>>; campos: GestionCampo[] };
export const GESTION_CONFIG: Record<string, GestionConfig> = {
  "id_persona": {
    "endpoint": "persons",
    "permisos": {
      "ver": "personas.verpersonas",
      "crear": "personas.crear",
      "editar": "personas.editar",
      "eliminar": "personas.eliminar"
    },
    "campos": [
      {
        "clave": "nombres",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "apellido_paterno",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "apellido_materno",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "telefono",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 20
      },
      {
        "clave": "direccion",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 200
      },
      {
        "clave": "correo",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 255
      },
      {
        "clave": "fecha_registro",
        "obligatorio": true,
        "tipo": "date"
      }
    ]
  },
  "id_persona_documento": {
    "endpoint": "person-documents",
    "permisos": {
      "ver": "personas.verpersonas",
      "crear": "personas.crear",
      "editar": "personas.editar",
      "eliminar": "personas.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "id_tipo_documento",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_tipo_documento"
      },
      {
        "clave": "numero_documento",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_persona_trabajador": {
    "endpoint": "person-workers",
    "permisos": {
      "ver": "ponentes-firmantes.ver",
      "crear": "ponentes-firmantes.crear",
      "editar": "ponentes-firmantes.editar",
      "eliminar": "ponentes-firmantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "id_area",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_area"
      },
      {
        "clave": "cargo",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "fecha_ingreso",
        "obligatorio": true,
        "tipo": "date"
      },
      {
        "clave": "fecha_fin",
        "obligatorio": false,
        "tipo": "date"
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "boolean"
      }
    ]
  },
  "id_persona_practicante": {
    "endpoint": "practicing-individuals",
    "permisos": {
      "ver": "practicantes.ver",
      "crear": "practicantes.crear",
      "editar": "practicantes.editar",
      "eliminar": "practicantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "codigo",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 50
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 30
      }
    ]
  },
  "id_practica": {
    "endpoint": "practices",
    "permisos": {
      "ver": "practicantes.ver",
      "crear": "practicantes.crear",
      "editar": "practicantes.editar",
      "eliminar": "practicantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona_practicante",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona_practicante"
      },
      {
        "clave": "id_institucion",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_institucion"
      },
      {
        "clave": "id_area",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_area"
      },
      {
        "clave": "carrera",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 55
      },
      {
        "clave": "fecha_inicio",
        "obligatorio": true,
        "tipo": "date"
      },
      {
        "clave": "fecha_fin",
        "obligatorio": false,
        "tipo": "date"
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_practica_supervisor": {
    "endpoint": "supervisory-internships",
    "permisos": {
      "ver": "practicantes.ver",
      "crear": "practicantes.crear",
      "editar": "practicantes.editar",
      "eliminar": "practicantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_practica",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_practica"
      },
      {
        "clave": "id_persona_trabajador",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona_trabajador"
      },
      {
        "clave": "tipo_supervision",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "fecha_inicio",
        "obligatorio": true,
        "tipo": "date"
      },
      {
        "clave": "fecha_fin",
        "obligatorio": false,
        "tipo": "date"
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_persona_ponente": {
    "endpoint": "person-speakers",
    "permisos": {
      "ver": "ponentes-firmantes.ver",
      "crear": "ponentes-firmantes.crear",
      "editar": "ponentes-firmantes.editar",
      "eliminar": "ponentes-firmantes.eliminar"
    },
    "campos": [
      {
        "clave": "id_persona",
        "obligatorio": true,
        "tipo": "number",
        "relacion": "id_persona"
      },
      {
        "clave": "id_institucion",
        "obligatorio": false,
        "tipo": "number",
        "relacion": "id_institucion"
      },
      {
        "clave": "cargo",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "especialidad",
        "obligatorio": false,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_area": {
    "endpoint": "areas",
    "permisos": {
      "ver": "areas.ver",
      "crear": "areas.crear",
      "editar": "areas.editar",
      "eliminar": "areas.eliminar"
    },
    "campos": [
      {
        "clave": "nombre",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 100
      }
    ]
  },
  "id_tipo_documento": {
    "endpoint": "document-types",
    "permisos": {
      "ver": "tipos-documento.ver",
      "crear": "tipos-documento.crear",
      "editar": "tipos-documento.editar",
      "eliminar": "tipos-documento.eliminar"
    },
    "campos": [
      {
        "clave": "nombre",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "estado",
        "obligatorio": true,
        "tipo": "boolean"
      }
    ]
  },
  "id_institucion": {
    "endpoint": "institutions",
    "permisos": {
      "ver": "instituciones.ver",
      "crear": "instituciones.crear",
      "editar": "instituciones.editar",
      "eliminar": "instituciones.eliminar"
    },
    "campos": [
      {
        "clave": "nombre_institucion",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 150
      },
      {
        "clave": "pais",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 50
      },
      {
        "clave": "tipo",
        "obligatorio": true,
        "tipo": "text",
        "maximo": 30
      }
    ]
  }
};
