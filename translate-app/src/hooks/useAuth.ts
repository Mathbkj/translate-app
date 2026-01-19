import { use, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getUsername } from "src/lib/getUserId";

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
