

const workflows = [
  {
      name: 'Empleados DMS - Nomizen ',
      description: 'Cuando un tercero es creado como empleado en DMS que sea creado tambien en Nomizen',
      microprocess: 'Sincronizacion empleados  DMS - Nomizen '
  },
  {
      name: 'Liquidacion automatica de recargos en la noche',
      description: 'Todos los dias en la noche el robot se activa y liquidan los recargos',
      microprocess: 'Liquidacion automatica de recargos'
  },
  {
      name: 'Validacion de liquidacion de recargos',
      description: 'Cuando el robot detecta una inonsistencia en la liquidacion de un recargo, esta se valida y se envia correo',
      microprocess: 'Liquidacion automatica de recargos'
  }
];
//Resolvers
const resolvers ={
  Query: {
    getWorkflows: () =>  workflows,
    getMicroProcess: () =>  workflows
    
  }
}

module.exports = resolvers;