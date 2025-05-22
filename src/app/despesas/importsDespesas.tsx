// src/imports/despesasImports.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ExpenseForm from "@/components/ExpenseForm";
import { Modal } from "@/components/Modal";
import { MonthSelect } from "@/components/MonthSelect";
import { YearSelector } from "@/components/YearSelector";
import { ExpenseSummary } from "@/components/ExpenseSummary";
import { ExpenseByTypeChart } from "@/components/ExpenseByTypeChart";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import AlertThresholdForm from "@/components/AlertsForm";
import CategoryManagerForm from "@/components/ExpenseCategoryForm";
import CreditCardForm from "@/components/CreditCardForm";

import { useExpenses } from "@/contexts/ExpensesContext";
import { useDate } from "@/contexts/DateContext";
import { useUser } from "@/contexts/UserContext";
import { AlertThresholdProvider } from "@/contexts/AlertThresholdContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CreditCardProvider } from "@/contexts/CreditCardContext";

import { useFetchExpenses } from "@/hooks/useFetchExpenses";

import FancyButton from "@/components/ClickButton";

// 🔁 Exporta todos juntos
export {
  useState,
  useEffect,
  useRouter,
  ExpenseForm,
  Modal,
  MonthSelect,
  YearSelector,
  ExpenseSummary,
  ExpenseByTypeChart,
  MonthlyExpensesChart,
  AlertThresholdForm,
  CategoryManagerForm,
  CreditCardForm,
  useExpenses,
  useDate,
  useUser,
  AlertThresholdProvider,
  CategoryProvider,
  CreditCardProvider,
  useFetchExpenses,
  FancyButton,
};

export type { Expense } from "@/interfaces/Expense";
