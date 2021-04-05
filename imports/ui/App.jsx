import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "../db/TasksCollection";
import { Task } from "./Task";
import { TaskForm } from "./TaskForm";
import { LoginForm } from "./LoginForm";

const logout = () => Meteor.logout();
const toggleChecked = ({ _id, isChecked }) =>
  Meteor.call("tasks.setIsChecked", _id, !isChecked);
const deleteTask = ({ _id }) => Meteor.call("tasks.remove", _id);

export const App = () => {
  const user = Meteor.user();

  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };
  const userFilter = user ? { userId: user._id } : {};

  const { tasks } = useTracker(() => {
    const noDataAvailable = { tasks: [] };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe("tasks");

    if (!handler.ready()) {
      return { ...noDataAvailable };
    }

    const tasks = TasksCollection.find(
      hideCompleted ? hideCompletedFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();

    return { tasks };
  });

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
