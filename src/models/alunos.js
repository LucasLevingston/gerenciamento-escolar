const Joi = require('joi');
const Endereco = require('./Endereco');

class Aluno {
   constructor({ matricula, nomeCompleto, cpf, endereco, curso }) {
      this.matricula = matricula;
      this.nomeCompleto = nomeCompleto;
      this.cpf = cpf;
      this.endereco = new Endereco(endereco);
      this.curso = curso;
   }

   static validate(aluno) {
      const schema = Joi.object({
         matricula: Joi.number().required(),
         nomeCompleto: Joi.string().max(255).required(),
         cpf: Joi.string().max(13).required(),
         endereco: Joi.object().required(),
         curso: Joi.string().max(255).required(),
      });

      const result = schema.validate(aluno);
      if (result.error) {
         return result;
      }

      const enderecoValidation = Endereco.validate(aluno.endereco);
      if (enderecoValidation.error) {
         return enderecoValidation;
      }

      return result;
   }
}

module.exports = Aluno;
