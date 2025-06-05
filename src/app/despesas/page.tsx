"use client";

import { Plus, TriangleAlert } from "lucide-react";
import {
  useState,
  useEffect,
  useRouter,
  ExpenseForm,
  Modal,
  MonthSelect,
  YearSelector,
  ExpenseSummary,
  AlertThresholdForm,
  useExpenses,
  useDate,
  useUser,
  AlertThresholdProvider,
  useFetchExpenses,
  Expense,
  CreditCardProvider,
  CategoryProvider,
} from "./importsDespesas";

export default function DespesasPage() {
  const { user } = useUser();
  const router = useRouter();

  const { selectedMonth, selectedYear, setYear } = useDate();
  const { expenses, deleteExpense } = useExpenses();
  useFetchExpenses();

  const [showAlertModal, setShowAlertModal] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  const openExpenseModal = (expense?: Expense) => {
    setEditingExpense(expense ?? null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingExpense(null);
    setModalOpen(false);
  };

  return (
    <AlertThresholdProvider>
      <CategoryProvider>
        <CreditCardProvider>
          <main className="w-full bg-gray-50 text-black px-4 md:px-6 py-6 md:py-8 flex flex-col items-center gap-6 min-h-screen">
            <div className="flex flex-col self-start mb-2">
              <h1 className="text-xl lg:text-4xl font-extrabold mt-12 lg:mt-2">
                Despesas
              </h1>
              <span className="text-sm text-gray-600">
                Gerencie suas despesas aqui
              </span>
            </div>

            {/* Filtros e botões */}
            <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              {/* Selects lado a lado no mobile */}
              <div className="flex gap-4 lg:w-[50%]">
                <YearSelector
                  value={selectedYear?.toString()}
                  onValueChange={(value) => setYear(Number(value))}
                />
                <MonthSelect />
              </div>

              {/* Botões lado a lado, alinhados à direita */}
              <div className="flex gap-4 justify-end w-full lg:w-[50%]">
                <button
                  className="bg-blue-600 w-full lg:w-60 px-4 py-3 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => openExpenseModal()}
                >
                  <Plus />
                  Nova Despesa
                </button>

                <button
                  className="bg-blue-600 w-full lg:w-60 px-4 py-3 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => setShowAlertModal(true)}
                >
                  <TriangleAlert />
                  Alertas de Gasto
                </button>
              </div>
            </div>

            {/* Modal de despesa */}
            <Modal isOpen={modalOpen} onClose={closeModal}>
              <ExpenseForm
                expenseToEdit={editingExpense}
                onCancelEdit={closeModal}
                onExpenseUpdated={closeModal}
              />
            </Modal>

            {/* Modal de alertas */}
            <Modal
              isOpen={showAlertModal}
              onClose={() => setShowAlertModal(false)}
            >
              <AlertThresholdForm
                onSaveSuccess={() => setShowAlertModal(false)}
              />
            </Modal>

            {/* Lista de despesas */}
            <div className="w-full mt-2">
              <ExpenseSummary
                expenses={expenses}
                year={selectedYear}
                month={selectedMonth}
                onDelete={deleteExpense}
                onEdit={(e) => openExpenseModal(e)}
              />
            </div>
          </main>
        </CreditCardProvider>
      </CategoryProvider>
    </AlertThresholdProvider>
  );
}
