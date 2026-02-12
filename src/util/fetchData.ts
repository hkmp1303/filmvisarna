

export default async function fetchData<Type>(url: string, options = {}) {
  let response = await fetch(url, options);

  let data: Type = await response.json();

  return data;
};