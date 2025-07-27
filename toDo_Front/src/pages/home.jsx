import React from 'react';

import AddTask from '../components/add_task';
import TasksTable from '../components/get_task';

// import PrivateRoute from './authenticate/privateRoute';

function Home() {
  return (
    <div>
      <AddTask />
      <TasksTable />
    </div>

  );
}

export default Home;
