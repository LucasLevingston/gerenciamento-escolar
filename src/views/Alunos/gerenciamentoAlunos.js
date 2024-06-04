import React from "react";
import axios from 'axios';
import MaterialTable from "material-table";

const GerenciamentoAlunos = props => {
  const { useState, useEffect } = React;

  const [data, setData] = useState([
  ]);
  const [enderecoData, setEnderecoData] = useState([
  ]);

  useEffect(() => {
    handleClick();
  }, []);

  function handleClick() {
    axios
      .get(baseUrl + "/alunos")
      .then(response => {
        const alunos = response.data.lista.map(c => {
          return {
            id: c.id,
            cpf: c.cpf,
            matricula: c.matricula,
            nome: c.nome,
            idEndereco: c.idEndereco,
            curso: c.curso
          };
        });

        setData(alunos);
      })
      .catch(error => console.log(error));
  }
  const baseUrl = 'http://demo4138820.mockable.io'

  function handleCreate(newData) {
    return new Promise((resolve, reject) => {
      const newId = Math.max(...data.map(aluno => aluno.id)) + 1;
      const newEnderecoId = enderecoData.length + 1;
      const newEndereco = { ...newData.endereco, id: newEnderecoId };

      axios
        .post(baseUrl + "/alunos/create", {
          "id": newId,
          "cpf": newData.cpf,
          "matricula": newData.matricula,
          "nome": newData.nome,
          "endereco": newEndereco,
          "curso": newData.curso
        })
        .then(function (response) {
          console.log(response.data.msg);
          setEnderecoData([...enderecoData, newEndereco]);
          resolve();
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  function handleUpdate(newData) {
    return new Promise((resolve, reject) => {
      const erros = validateData(newData);
      if (erros.length > 0) {
        reject(new Error(`Erro ao atualizar aluno: ${erros.join(', ')}`));
        return;
      }

      const dataAtual = data.find(opcao => opcao.id === newData.id);
      const newEnderecoId = enderecoData.length + 1;
      const newEndereco = { ...newData.endereco, id: newEnderecoId };

      axios
        .put(baseUrl + "/alunos/update", {
          "id": newData.id,
          "cpf": newData.cpf,
          "matricula": newData.matricula,
          "nome": newData.nome,
          "endereco": newEndereco,
          "curso": newData.curso
        })
        .then(function (response) {
          console.log(response.data.msg);

          if (JSON.stringify(newData.endereco) !== JSON.stringify(dataAtual.endereco)) {
            setEnderecoData([...enderecoData, newEndereco]);
          }

          const updatedData = data.map(item =>
            item.id === newData.id ? { ...item, ...newData, endereco: newEndereco } : item
          );

          setData(updatedData);

          resolve();
        })
        .catch(error => {
          console.error("Erro ao atualizar aluno:", error);
          reject(error);
        });
    });
  }



  function handleDelete(newData) {
    axios
      .delete(baseUrl + "/alunos/delete", {
        "id": newData.id
      })
      .then(function (response) {
        console.log(response.data.msg)
      });
  }
  function validateData(aluno) {
    const erros = [];

    // Validação do campo Nome completo
    if (typeof aluno.nome !== 'string' || aluno.nome.length === 0 || aluno.nome.length > 255) {
      erros.push('O campo Nome completo do aluno deve ser uma string com no máximo 255 caracteres.');
    }

    // Validação do campo CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (typeof aluno.cpf !== 'string' || !cpfRegex.test(aluno.cpf)) {
      erros.push('O campo CPF do aluno deve ser uma string no formato XXX.XXX.XXX-XX.');
    }

    // Validação do campo Endereço
    if (!aluno.endereco || typeof aluno.endereco !== 'object') {
      erros.push('O campo Endereço do aluno deve ser um objeto.');
    }
    // Validação do campo Curso
    if (typeof aluno.curso !== 'string' || aluno.curso.length > 255) {
      erros.push('O campo Curso do aluno deve ser uma string com no máximo 255 caracteres.');
    }

    return erros;
  }
  return (

    <MaterialTable
      title="Gerenciamento de Alunos"
      columns={[
        { title: 'Id', field: 'id', editable: "never" },
        { title: 'nome', field: 'nome', searchable: true },
        { title: 'matricula', field: 'matricula', type: 'numeric', align: "center" },
        { title: 'cpf', field: 'cpf', type: 'string' },
        {
          title: 'Endereço',
          field: 'endereco',
          render: rowData => {
            if (!rowData.endereco) {
              return (
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" disabled>
                    Sem endereço
                  </button>
                </div>
              );
            }
            return (
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {`${rowData.endereco.id} - ${rowData.endereco.rua}`}
                </button>
                <ul className="dropdown-menu">
                  <li className="dropdown-item">Rua: {rowData.endereco.rua}</li>
                  <li className="dropdown-item">Número: {rowData.endereco.numero}</li>
                  <li className="dropdown-item">Cidade: {rowData.endereco.cidade}</li>
                  <li className="dropdown-item">Estado: {rowData.endereco.estado}</li>
                  <li className="dropdown-item">Estado: {rowData.endereco.pais}</li>
                  <li className="dropdown-item">CEP: {rowData.endereco.cep}</li>
                </ul>
              </div>
            )
          },
          editComponent: props => {
            const endereco = props.value || {};
            return (
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Endereço
                </button>
                <ul className="dropdown-menu p-3" style={{ minWidth: '200px' }}>
                  <li>
                    <input
                      className="form-control mb-2"
                      onChange={(e) => props.onChange({ ...endereco, rua: e.target.value })}
                      placeholder="Rua"
                      value={endereco.rua || ''}
                      maxLength={255}
                    />
                  </li>
                  <li>
                    <input
                      className="form-control mb-2"
                      onChange={(e) => props.onChange({ ...endereco, numero: e.target.value })}
                      placeholder="Número"
                      value={endereco.numero || ''}
                      maxLength={8}
                    />
                  </li>
                  <li>
                    <input
                      className="form-control mb-2"
                      onChange={(e) => props.onChange({ ...endereco, cidade: e.target.value })}
                      placeholder="Cidade"
                      value={endereco.cidade || ''}
                      maxLength={50}
                    />
                  </li>
                  <li>
                    <input
                      className="form-control mb-2"
                      onChange={(e) => props.onChange({ ...endereco, estado: e.target.value })}
                      placeholder="Estado"
                      value={endereco.estado || ''}
                      maxLength={50}
                    />
                  </li>
                  <li>
                    <input
                      className="form-control mb-2"
                      onChange={(e) => props.onChange({ ...endereco, pais: e.target.value })}
                      placeholder="País"
                      value={endereco.pais || ''}
                      maxLength={50}
                    />
                  </li>
                  <li>
                    <input
                      className="form-control"
                      onChange={(e) => props.onChange({ ...endereco, cep: e.target.value })}
                      placeholder="CEP"
                      value={endereco.cep || ''}
                      maxLength={14}
                    />
                  </li>
                </ul>
              </div>
            );
          }
        }
        , { title: 'curso', field: 'curso' }
      ]}
      options={{ sorting: true, searchAutoFocus: true, }}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleCreate(newData)
                .then(() => {
                  const dataCreate = [...data];
                  setData([...dataCreate, newData]);
                  resolve();
                })
                .catch(error => {
                  console.error('Erro ao adicionar novo aluno:', error);
                  reject();
                });
            }, 1000);
          }),

        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            const errors = validateData(newData);

            if (Object.keys(errors).length > 0) {
              alert(`Erro na validação: ${JSON.stringify(errors)}`);
              reject();
            } else {
              handleUpdate(newData, oldData)
                .then(() => {
                  resolve();
                })
                .catch(error => {
                  console.error('Erro ao atualizar aluno:', error);
                  reject();
                });
            }
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
          })

      }}
    />
  )
}

export default GerenciamentoAlunos;
