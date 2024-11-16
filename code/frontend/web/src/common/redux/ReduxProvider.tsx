"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useStore } from "@/store/store";
import { checkUserSession } from "@/store/userSlice";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    store.dispatch(checkUserSession());
  }, [store]);

  if (!isClient) return null;

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
