// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveToStorage = (data: any) => {
  localStorage.setItem("competition_config", JSON.stringify(data));
};

export const getFromStorage = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("competition_config");
  return data ? JSON.parse(data) : null;
};
