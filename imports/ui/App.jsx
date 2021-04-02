import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";

const deleteTask = ({ _id }) => TasksCollection.remove(_id);

const logout = () => Meteor.logout();

const toggleChecked = ({ _id, isChecked }) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked,
    },
  });
};

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const user = useTracker(() => Meteor.user());

  const hideCompletedFilter = { isChecked: { $ne: true } };
  const userFilter = user ? { userId: user._id } : {};

  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? hideCompletedFilter : userFilter, {
      sort: { createdAt: -1 },
    }).fetch()
  );

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      {user ? (
        <>
          <div className="user" onClick={logout}>
            {user.username} 🚪
          </div>
          <TaskForm user={user} />

          <div className="filter">
            <button onClick={() => setHideCompleted(!hideCompleted)}>
              {hideCompleted ? "Show All" : "Hide Completed"}
            </button>
          </div>

          <ul>
            {tasks.map((task) => (
              <Task
                key={task._id}
                task={task}
                onCheckboxClick={toggleChecked}
                onDeleteClick={deleteTask}
              />
            ))}
          </ul>
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
};
