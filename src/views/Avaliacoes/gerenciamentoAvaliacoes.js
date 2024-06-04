import React, { useState, useEffect } from "react";
import axios from 'axios';
import MaterialTable from "material-table";
import Select from 'react-select';

const GerenciamentoAvaliacoes = () => {
  const [data, setData] = useState([]);
  const [alunosData, setAlunosData] = useState([]);
  const [componentesCurricularesData, setComponentesCurricularesData] = useState([]);

  const baseUrl = "http://demo4138820.mockable.io"
  useEffect(() => {
    fetchData();
  }, []);
  const componentesCurriculares = [
    {
      id: 1,
      nome: 'Matemática Aplicada',
      sigla: 'MATAPL',
      matrizCurricular: 'Engenharia',
      cargaHoraria: '0400'
    },
    {
      id: 2,
      nome: 'Física Teórica',
      sigla: 'FISTEO',
      matrizCurricular: 'Ciências Exatas',
      cargaHoraria: '0300'
    },
    {
      id: 3,
      nome: 'Química Orgânica',
      sigla: 'QUIORG',
      matrizCurricular: 'Ciências Naturais',
      cargaHoraria: '0250'
    },
    {
      id: 4,
      nome: 'Introdução à Programação',
      sigla: 'INTPROG',
      matrizCurricular: 'Computação',
      cargaHoraria: '0500'
    },
    {
      id: 5,
      nome: 'História da Arte',
      sigla: 'HISART',
      matrizCurricular: 'Artes',
      cargaHoraria: '0200'
    },
    {
      id: 6,
      nome: 'Economia de Empresas',
      sigla: 'ECONEMP',
      matrizCurricular: 'Administração',
      cargaHoraria: '0350'
    },
    {
      id: 7,
      nome: 'Direito Constitucional',
      sigla: 'DIRCON',
      matrizCurricular: 'Direito',
      cargaHoraria: '0400'
    },
    {
      id: 8,
      nome: 'Microbiologia',
      sigla: 'MICROBIO',
      matrizCurricular: 'Biomedicina',
      cargaHoraria: '0450'
    },
    {
      id: 9,
      nome: 'Psicologia Social',
      sigla: 'PSICSOC',
      matrizCurricular: 'Psicologia',
      cargaHoraria: '0300'
    },
    {
      id: 10,
      nome: 'Gestão de Projetos',
      sigla: 'GESPROJ',
      matrizCurricular: 'Engenharia de Produção',
      cargaHoraria: '0600'
    }
  ];

  const fetchData = async () => {
    try {
      const [avaliacoesResponse, alunosResponse] = await Promise.all([
        axios.get(baseUrl + "/avaliacoes"),
        axios.get(baseUrl + "/alunos")
      ]);

      setData(avaliacoesResponse.data.lista);
      setAlunosData(alunosResponse.data.lista);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async newData => {
    try {
      const newId = Math.max(...data.map(aluno => aluno.id)) + 1;
      const response = await axios.post(baseUrl + "/avaliacoes/create", {
        "id": newId,
        "periodoAvaliacao": newData.periodoAvaliacao,
        "componenteCurricular": newData.componenteCurricular,
        "categoriaAvaliacao": newData.categoriaAvaliacao,
        "conceitoProfessor": newData.conceitoProfessor,
        "conceitoRelevanciaDisciplina": newData.conceitoRelevanciaDisciplina,
        "alunos": newData.alunos
      });
      return response
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleUpdate = async (newData, oldData) => {
    try {
      setData(prevData => prevData.map(data => (data.id === oldData.id ? newData : data)));
      // await axios.put(baseUrl+`/avaliacao/update/${oldData.id}`, newData);
      //Apenas o acesso a rota
      const response = await axios.put(baseUrl + `/avaliacoes/update`, newData);

      return response ? newData : null
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const handleDelete = async oldData => {
    try {
      const response = await axios.delete(`http://demo4138820.mockable.io/avaliacoes/delete`);
      setData(prevData => prevData.filter(data => data.id !== oldData.id));
      return response.data
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

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

  const validateData = data => {
    const errors = {};

    if (!data.periodoAvaliacao) {
      errors.periodoAvaliacao = 'Período Avaliação é obrigatório';
    }

    if (!data.categoriaAvaliacao) {
      errors.categoriaAvaliacao = 'Categoria Avaliação é obrigatório';
    }

    if (!data.conceitoProfessor || data.conceitoProfessor < 0 || data.conceitoProfessor > 10) {
      errors.conceitoProfessor = 'Conceito do Professor deve estar entre 0 e 10';
    }

    if (!data.conceitoRecursoDidatico || data.conceitoRecursoDidatico < 0 || data.conceitoRecursoDidatico > 10) {
      errors.conceitoRecursoDidatico = 'Conceito do Recurso Didático deve estar entre 0 e 10';
    }

    if (!data.conceitoRelevanciaDisciplina || data.conceitoRelevanciaDisciplina < 0 || data.conceitoRelevanciaDisciplina > 10) {
      errors.conceitoRelevanciaDisciplina = 'Conceito da Relevância da Disciplina deve estar entre 0 e 10';
    }

    if (!data.alunos || !Array.isArray(data.alunos) || data.alunos.some(aluno => typeof aluno !== 'object')) {
      console.log(data.alunos)
      errors.alunos = 'Alunos deve ser uma lista de objetos';
    }

    return errors;
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
          field: 'componenteCurricular',
          render: rowData => (
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {`${rowData.componenteCurricular.id} - ${rowData.componenteCurricular.nome}`}
              </button>
              <ul className="dropdown-menu">
                <li className="dropdown-item">Sigla: {rowData.componenteCurricular.sigla}</li>
                <li className="dropdown-item">Matriz: {rowData.componenteCurricular.matrizCurricular}</li>
                <li className="dropdown-item">Carga Horária: {rowData.componenteCurricular.cargaHoraria}</li>
              </ul>
            </div>
          ),
          editComponent: props => (
            <select
              className="form-select"
              value={props.value ? props.value.id : ''}
              onChange={e => {
                const selectedId = e.target.value;
                const selectedComponente = componentesCurriculares.find(c => c.id == selectedId);
                props.onChange(selectedComponente);
              }}
            >
              <option value="" disabled>Selecione um Componente Curricular</option>
              {componentesCurriculares.map(componente => (
                <option key={componente.id} value={componente.id}>
                  {`${componente.id} - ${componente.nome}`}
                </option>
              ))}
            </select>
          )
        }
        ,
        { title: 'Categoria Avaliação', field: 'categoriaAvaliacao', type: 'string' },
        { title: 'Conceito do Professor', field: 'conceitoProfessor', type: 'numeric' },
        { title: 'Conceito do Recurso Didático', field: 'conceitoRecursoDidatico', type: 'numeric' },
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
                  <li className="dropdown-item" key={i}>{`${i + 1} - ${aluno.nome}`}</li>
                ))}
              </ul>
            </div>
          ),
          editComponent: rowData => (
            <Select
              isMulti
              options={alunosData.map(aluno => ({ value: aluno, label: `${aluno.id}-${aluno.nome}` }))}
              value={rowData.value || []}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
              onChange={selectedData => {
                rowData.onChange(selectedData)
              }}
            />
          )
        }
      ]}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            const errors = validateData(newData);

            if (Object.keys(errors).length > 0) {
              alert(`Erro na validação: ${JSON.stringify(errors)}`);
              reject();
            } else {
              handleCreate(newData);

              const newId = Math.max(...data.map(aluno => aluno.id)) + 1;
              const newIdComponente = Math.max(...componentesCurriculares.map(componente => componente.id)) + 1;
              newData.componenteCurricular = { ...newData.componenteCurricular, id: newIdComponente }

              setComponentesCurricularesData([...componentesCurriculares, newData.componenteCurricular])
              setData([...data, { id: newId, ...newData }]);

              console.log("Criado com sucesso")
              resolve();
            }
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            const errors = validateData(newData);
            const selectedValues = newData.alunos.map(data => data.value)
            newData.alunos = selectedValues
            console.log(newData.alunos)
            if (Object.keys(errors).length > 0) {
              alert(`Erro na validação: ${JSON.stringify(errors)}`);
              reject();
            } else {
              handleUpdate(newData, oldData);
              console.log("Alterado com sucesso")
              resolve();
            }
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            handleDelete(oldData);
            console.log("Deletado com sucesso")
            resolve();
          }),
      }}
    />
  );
};

export default GerenciamentoAvaliacoes;
