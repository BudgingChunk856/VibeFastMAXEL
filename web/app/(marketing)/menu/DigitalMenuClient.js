"use client"

import { useMemo, useState } from "react"
import {
  Beef,
  ChevronDown,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  UtensilsCrossed,
  CupSoda,
} from "lucide-react"

const categories = [
  { id: "todos", label: "Todo" },
  { id: "tacos", label: "Tacos" },
  { id: "especialidades", label: "Especialidades" },
  { id: "beb