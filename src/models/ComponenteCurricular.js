const Joi = require('joi');

class Componente {
   constructor({ nome, sigla, matrizCurricular, cargaHoraria }) {
      this.nome = nome;
      this.sigla = sigla;
      this.matrizCurricular = matrizCurricular;
      this.cargaHoraria = cargaHoraria;
   }

   static validate(componente) {
      const schema = Joi.object({
         nome: Joi.string().max(255).required(),
         sigla: Joi.string().max(10).required(),
         matrizCurricular: Joi.string().max(255).required(),
         cargaHoraria: Joi.string().max(4).required(),
      });

      return schema.validate(componente);
   }
}

module.exports = Componente;
