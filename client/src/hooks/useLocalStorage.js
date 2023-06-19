import { useState, useEffect } from "react";

const getLocalValue = (key, initialValue) => {
  //SSR Next.js
  if (typeof window === "undefined") return initialValue;

  // if a value is already store
  let localValue = false;
  try {
    localValue = JSON.parse(localStorage.getItem(key));
  } catch {}
  if (localValue) return localValue;
  // return result of a function
  if (initialValue instanceof Function) return initialValue();

  return initialValue;
};

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
