import React from "react";
import axios from 'axios';
import MaterialTable from "material-table";

const GerenciamentoAlunos = props => {
  const { useState, useEffect } = React;

  const [data, setData] = useState([
  ]);

  useEffect(() => {
    handleClick();
  }, []);

  function handleClick() {
    axios
      .get("https://demo4138820.mockable.io/alunos")
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
        console.log(alunos.data)
        setData(alunos);
      })
      .catch(error => console.log(error));
  }

  function handleCreate(newData) {
    axios
      .post("https://demo4138820.mockable.io/alunos", {
        "id": newData.id,
        "cpf": newData.cpf,
        "matricula": newData.matricula,
        "nome": newData.nome,
        "idEndereco": newData.idEndereco,
        "curso": newData.curso
      })
      .then(function (response) {
        console.log('Salvo com sucesso.')
      });
  }

  function handleUpdate(newData) {
    axios
      .put("https://demo4138820.mockable.io/alunos", {
        "id": newData.id,
        "cpf": newData.cpf,
        "matricula": newData.matricula,
        "nome": newData.nome,
        "idEndereco": newData.idEndereco,
        "curso": newData.curso
      })
      .then(function (response) {
        console.log('Atualizado com sucesso.')
      });
  }

  function handleDelete(newData) {
    axios
      .delete("https://demo4138820.mockable.io/delete-aluno", {
        "id": newData.id
      })
      .then(function (response) {
        console.log('Deletado com sucesso.')
      });
  }

  return (
    [
      <MaterialTable
        title="Gerenciamento de Alunos"
        columns={[
          { title: 'Id', field: 'id' },
          { title: 'nome', field: 'nome', searchable: true },
          { title: 'matricula', field: 'matricula', type: 'numeric', align: "center" },
          { title: 'cpf', field: 'cpf' },
          {
            title: 'Endereço',
            field: 'endereco',
            render: rowData => (

              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {`${rowData.endereco.id} - ${rowData.endereco.nome}`}
                </button>
                <ul className="dropdown-menu">
                  <li className="dropdown-item">Rua: {rowData.endereco.rua}</li>
                  <li className="dropdown-item">Número: {rowData.endereco.numero}</li>
                  <li className="dropdown-item">Cidade: {rowData.endereco.cidade}</li>
                  <li className="dropdown-item">Estado: {rowData.endereco.estado}</li>
                  <li className="dropdown-item">CEP: {rowData.endereco.cep}</li>
                </ul>
              </div>
            ),
            editComponent: props => {
              const endereco = props.value || {};
              return (
                <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Componente Curricular
                  </button>
                  <ul className="dropdown-menu">
                    <input
                      className="dropdown-item"
                      onChange={(e) => props.onChange({ ...endereco, nome: e.target.value })}
                      placeholder="Rua"
                      value={endereco.rua || ''}
                    />
                    <input
                      className="dropdown-item"
                      onChange={(e) => props.onChange({ ...endereco, sigla: e.target.value })}
                      placeholder="Número"
                      value={endereco.numero || ''}
                    />
                    <input
                      className="dropdown-item"
                      onChange={(e) => props.onChange({ ...endereco, matrizCurricular: e.target.value })}
                      placeholder="Cidade"
                      value={endereco.cidade || ''}
                    />
                    <input
                      className="dropdown-item"
                      onChange={(e) => props.onChange({ ...endereco, cargaHoraria: e.target.value })}
                      placeholder="Estado"
                      value={endereco.estado || ''}
                    />
                    <input
                      className="dropdown-item"
                      onChange={(e) => props.onChange({ ...endereco, cargaHoraria: e.target.value })}
                      placeholder="CEP"
                      value={endereco.cep || ''}
                    />
                  </ul>
                </div>
              );
            }
          }, { title: 'curso', field: 'curso' }
        ]}
        options={{ sorting: true, searchAutoFocus: true, }}
        data={data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                handleCreate(newData)

                const dataCreate = [...data];

                setData([...dataCreate, newData]);

                resolve();
              }, 1000)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);

                resolve();
              }, 1000)
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                handleDelete(oldData)
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);

                resolve()
              }, 1000)
            }),
        }}
      />,]
  )
}

export default GerenciamentoAlunos;
