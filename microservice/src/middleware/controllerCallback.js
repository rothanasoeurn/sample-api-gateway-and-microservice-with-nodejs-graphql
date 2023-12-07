const controllerCallback = async (actionHandler, args = null) => {
  try {
    return await actionHandler(args);
  } catch (error) {
    return error;
  }
};

export default controllerCallback;
