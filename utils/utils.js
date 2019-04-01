exports.timestampFormat = data => {
  const newData = [];
  data.forEach(item => {
    const { created_at, ...remaining } = item;
    let newtime = new Date(item.created_at).toISOString();
    newData.push({ created_at: newtime, ...remaining });
  });
  return newData;
};
