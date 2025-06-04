"use client";

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
  Expense,
} from "./importsDespesas";

export default function DespesasPage() {
  const { user } = useUser();
  const router = useRouter();

  const { selectedMonth, selectedYear } = useDate();
  const { expenses, deleteExpense } = useExpenses();
  useFetchExpenses();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
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
      <CreditCardProvider>
        <CategoryProvider>
          <main className="w-full bg-gray-50 text-black px-6 py-8 flex flex-col items-center gap-6">
            <h1 className="text-2xl font-bold">Gerenciador de Despesas</h1>
            <div className="flex justify-between w-full">
              <div className="flex gap-4">
                <YearSelector />
                <MonthSelect />
              </div>

              <div className="flex gap-4 mt-4 flex-wrap">
                <FancyButton onClick={() => openExpenseModal()}>
                  Nova Despesa
                </FancyButton>

                <FancyButton onClick={() => setShowCategoryModal(true)}>
                  Gerenciar Categorias
                </FancyButton>

                <FancyButton onClick={() => setShowAlertModal(true)}>
                  Alertas de Gasto
                </FancyButton>

                <FancyButton onClick={() => setShowCardModal(true)}>
                  Cartões de Crédito
                </FancyButton>
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

            {/* Modal de categorias */}
            <Modal
              isOpen={showCategoryModal}
              onClose={() => setShowCategoryModal(false)}
            >
              <CategoryManagerForm
                onSaveSuccess={() => setShowCategoryModal(false)}
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

            {/* Modal de cartões */}
            <Modal
              isOpen={showCardModal}
              onClose={() => setShowCardModal(false)}
            >
              <CreditCardForm />
            </Modal>

            {/* Lista de despesas */}
            <div className="w-full mt-6">
              <ExpenseSummary
                expenses={expenses}
                year={selectedYear}
                month={selectedMonth}
                onDelete={deleteExpense}
                onEdit={(e) => openExpenseModal(e)}
              />
            </div>

            {/* Visuais */}
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
