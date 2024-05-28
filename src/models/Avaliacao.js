const Joi = require('joi');
const Aluno = require('./Aluno');
const Componente = require('./Componente');

class Avaliacao {
   constructor({ periodo, componente, aluno, categoria, conceitoProfessor, conceitoRecursoDidatico, conceitoRelevancia }) {
      this.periodo = periodo;
      this.componente = new Componente(componente);
      this.aluno = new Aluno(aluno);
      this.categoria = categoria;
      this.conceitoProfessor = conceitoProfessor;
      this.conceitoRecursoDidatico = conceitoRecursoDidatico;
      this.conceitoRelevancia = conceitoRelevancia;
   }

   static validate(avaliacao) {
      const schema = Joi.object({
         periodo: Joi.string().max(6).required(),
         componente: Joi.object().required(),
         aluno: Joi.object().required(),
         categoria: Joi.string().max(100).required(),
         conceitoProfessor: Joi.number().integer().min(0).max(10).required(),
         conceitoRecursoDidatico: Joi.number().integer().min(0).max(10).required(),
         conceitoRelevancia: Joi.number().integer().min(0).max(10).required(),
      });

      const result = schema.validate(avaliacao);
      if (result.error) {
         return result;
      }

      const componenteValidation = Componente.validate(avaliacao.componente);
      if (componenteValidation.error) {
         return componenteValidation;
      }

      const alunoValidation = Aluno.validate(avaliacao.aluno);
      if (alunoValidation.error) {
         return alunoValidation;
      }

      return result;
   }
}

module.exports = Avaliacao;
