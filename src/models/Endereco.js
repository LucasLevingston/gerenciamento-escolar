const Joi = require('joi');

class Endereco {
   constructor({ rua, numero, cep, cidade, estado, pais }) {
      this.rua = rua;
      this.numero = numero;
      this.cep = cep;
      this.cidade = cidade;
      this.estado = estado;
      this.pais = pais;
   }

   static validate(endereco) {
      const schema = Joi.object({
         rua: Joi.string().max(255).required(),
         numero: Joi.string().max(8).required(),
         cep: Joi.string().max(14).required(),
         cidade: Joi.string().max(50).required(),
         estado: Joi.string().max(50).required(),
         pais: Joi.string().max(50).required(),
      });

      return schema.validate(endereco);
   }
}

module.exports = Endereco;
