const data = {
  issues: {
    "LX-5": {
      title: "Random Backlog Title 1",
      parent: "LB-1",
    },
    "LX-11": {
      title: "Random Backlog Title 2",
      parent: "LB-1",
    },
    "LX-12": {
      title: "Random Backlog Title 3",
      parent: "",
    },
    "LX-8": {
      title: "Random Todo Title 1",
      parent: "LB-3",
    },
    "LX-15": {
      title: "Random Todo Title 2",
      parent: "LB-2",
    },
    "LX-20": {
      title: "Random Todo Title 3",
      parent: "",
    },
    "LX-17": {
      title: "Random In Progress Title 1",
      parent: "LB-5",
    },
    "LX-22": {
      title: "Random In Progress Title 2",
      parent: "LB-4",
    },
    "LX-30": {
      title: "Random In Progress Title 3",
      parent: "",
    },
    "LX-25": {
      title: "Random Done Title 1",
      parent: "LB-7",
    },
    "LX-33": {
      title: "Random Done Title 2",
      parent: "LB-6",
    },
    "LX-40": {
      title: "Random Done Title 3",
      parent: "",
    },
  },
  columns: {
    backlog: {
      title: "Backlog",
      issues: ["LX-5", "LX-11", "LX-12"],
    },
    todo: {
      title: "To Do",
      issues: ["LX-8", "LX-15", "LX-20"],
    },
    inprogress: {
      title: "In Progress",
      issues: ["LX-17", "LX-22", "LX-30"],
    },
    done: {
      title: "Done",
      issues: ["LX-25", "LX-33", "LX-40"],
    },
  },
  columnsOrder: ["backlog", "todo", "inprogress", "done"],
};

export default data;
