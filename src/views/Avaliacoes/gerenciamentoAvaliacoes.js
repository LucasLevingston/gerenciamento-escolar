import React, { useState, useEffect } from "react";
import axios from 'axios';
import MaterialTable from "material-table";
import Joi, { number } from 'joi';

const GerenciamentoAvaliacoes = props => {

  const [data, setData] = useState([]);

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = () => {
    axios
      .get("https://demo4138820.mockable.io/avaliacoes")
      .then(response => {
        const dados = response.data.lista;
        setData(dados);
      })
      .catch(error => console.log(error));
  };

  function handleCreate(newData) {
    const newId = data[data.length].id
    console.log(newId)
    console.log(data)
    axios
      .post("https://demo4138820.mockable.io/avaliacao", {
        "id": newData.id,
        "cpf": newData.cpf,
        "matricula": newData.matricula,
        "nome": newData.nome,
        "cep": newData.cep,
        "curso": newData.curso
      })
      .then(function (response) {
        console.log('Salvo com sucesso:', response.data);
      });
  }

  function handleDelete(newData) {
    axios
      .delete("https://demo4138820.mockable.io/delete-aluno", {
        data: { "id": newData.id }
      })
      .then(function (response) {
        console.log('Deletado com sucesso.');
      });
  }

  const periodoAvaliacao = {
    2024.1: '2024.1',
    2023.2: '2023.2',
    2023.1: '2023.1',
    2022.2: '2022.2',
    2022.1: '2022.1',
    2021.2: '2021.2',
    2021.1: '2021.1',
    2020.2: '2020.2',
    2020.1: '2020.1',
    2019.2: '2019.2',
    2019.1: '2019.1'
  };

  const componentesCurriculares = [
    {
      id: 1,
      nome: 'Matemática Aplicada',
      sigla: 'MATAPL',
      matrizCurricular: 'Engenharia',
      cargaHoraria: '0400'
    },
    // Adicione mais componentes aqui...
  ];

  const validateData = (data) => {
    const schema = Joi.object({
      periodoAvaliacao: Joi.string().required().messages({
        'any.required': 'Período Avaliação é obrigatório'
      }),
      categoriaAvaliacao: Joi.string().max(100).required().messages({
        'any.required': 'Categoria Avaliação é obrigatório'
      }),
      conceitoProfessor: Joi.number().integer().min(0).max(10).required().messages({
        'number.base': 'Conceito do Professor deve ser um número',
        'number.min': 'Conceito do Professor deve estar entre 0 e 10',
        'number.max': 'Conceito do Professor deve estar entre 0 e 10'
      }),
      conceitoRecursoDidatico: Joi.number().integer().min(0).max(10).required().messages({
        'number.base': 'Conceito do Recurso Didático deve ser um número',
        'number.min': 'Conceito do Recurso Didático deve estar entre 0 e 10',
        'number.max': 'Conceito do Recurso Didático deve estar entre 0 e 10'
      }),
      conceitoRelevanciaDisciplina: Joi.number().integer().min(0).max(10).required().messages({
        'number.base': 'Conceito da Relevância da Disciplina deve ser um número',
        'number.min': 'Conceito da Relevância da Disciplina deve estar entre 0 e 10',
        'number.max': 'Conceito da Relevância da Disciplina deve estar entre 0 e 10'
      }),
      componenteCurricular: Joi.object({
        id: Joi.number().required(),
        nome: Joi.string().max(255).required(),
        sigla: Joi.string().max(10).required(),
        matrizCurricular: Joi.string().max(255).required(),
        cargaHoraria: Joi.string().max(4).required()
      }).required().messages({
        'any.required': 'Componente Curricular é obrigatório'
      })
    });

    const result = schema.validate(data, { abortEarly: false });
    return result.error ? result.error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {}) : null;
  };

  const componentesCurricularesLookup = componentesCurriculares.reduce((lookup, componente) => {
    lookup[componente.id] = componente.nome;
    return lookup;
  }, {});

  return (
    <MaterialTable
      title="Gerenciamento de Avaliações"
      columns={[
        { title: 'Id', field: 'id', editable: 'never' },
        { title: 'Período Avaliação', field: 'periodoAvaliacao', lookup: periodoAvaliacao },
        {
          title: 'Componente Curricular',
          field: 'componenteCurricular.nome',
          lookup: componentesCurricularesLookup,
          render: rowData => (
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {rowData.componenteCurricular.nome}
              </button>
              <ul className="dropdown-menu">
                <li className="dropdown-item">Sigla: {rowData.componenteCurricular.sigla}</li>
                <li className="dropdown-item">Matriz: {rowData.componenteCurricular.matrizCurricular}</li>
                <li className="dropdown-item">Carga Horária: {rowData.componenteCurricular.cargaHoraria}</li>
              </ul>
            </div>
          )
        },
        { title: 'Categoria Avaliação', field: 'categoriaAvaliacao', type: "string" },
        { title: 'Conceito do Professor', field: 'conceitoProfessor', type: 'numeric', },
        { title: 'Conceito do Recurso Didático', field: 'conceitoRecursoDidatico', type: 'numeric', },
        { title: 'Conceito da Relevância da Disciplina', field: 'conceitoRelevanciaDisciplina', type: 'numeric' },
        {
          title: "Alunos",
          field: "alunos",
          render: rowData => (
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Alunos
              </button>
              <ul className="dropdown-menu">
                {rowData.alunos && rowData.alunos.map((aluno, i) => (
                  <li className="dropdown-item" key={i}>{aluno.nomeCompleto}</li>
                ))}
              </ul>
            </div>
          )
        }
      ]}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            const errors = validateData(newData);

            if (errors) {
              alert(`Erro na validação: ${Object.values(errors).join(', ')}`);
              reject();
            } else {
              setTimeout(() => {
                handleCreate(newData);
                const dataCreate = [...data];
                dataCreate.push(newData);
                setData(dataCreate);
                resolve();
              }, 1000);
            }
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const errors = validateData(newData);

              if (errors) {
                alert(`Erro na validação: ${Object.values(errors).join(', ')}`);
                reject();
              } else {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                resolve();
              }
            }, 1000);
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleDelete(oldData);
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default GerenciamentoAvaliacoes;
