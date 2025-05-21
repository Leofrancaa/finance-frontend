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
          <main className="w-full bg-gray-200 text-black px-6 py-8 flex flex-col items-center gap-6 mt-20">
            <h1 className="text-2xl font-bold">Gerenciador de Despesas</h1>
            <div className="flex justify-between w-[96vw]">
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
              <div className="mb-4">
                <h2 className="text-xl font-bold text-black">
                  {editingExpense ? "Editar Despesa" : "Nova Despesa"}
                </h2>
              </div>

              {/* Aqui você adiciona o seletor de mês */}
              <div className="mb-4 ">
                <MonthSelect />
              </div>

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
              <div className="mb-4">
                <h2 className="text-xl font-bold">Gerenciar Categorias</h2>
              </div>
              <CategoryManagerForm
                onSaveSuccess={() => setShowCategoryModal(false)}
              />
            </Modal>

            {/* Modal de alertas */}
            <Modal
              isOpen={showAlertModal}
              onClose={() => setShowAlertModal(false)}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold">Alertas de Gasto</h2>
              </div>
              <AlertThresholdForm
                onSaveSuccess={() => setShowAlertModal(false)}
              />
            </Modal>

            {/* Modal de cartões */}
            <Modal
              isOpen={showCardModal}
              onClose={() => setShowCardModal(false)}
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold">Gerenciar Cartões</h2>
              </div>
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
            <ExpenseByTypeChart />
            <MonthlyExpensesChart />
          </main>
        </CategoryProvider>
      </CreditCardProvider>
    </AlertThresholdProvider>
  );
}
