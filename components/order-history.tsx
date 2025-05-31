import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample order data
const orders = [
  {
    id: "ORD-001",
    date: "15.05.2024",
    status: "Доставлено",
    total: "598 ₴",
    items: [{ name: "Чохол на ID-картку 'Гаррі Поттер'", quantity: 2 }],
  },
  {
    id: "ORD-002",
    date: "02.04.2024",
    status: "Доставлено",
    total: "299 ₴",
    items: [{ name: "Чохол на ID-картку 'Наруто'", quantity: 1 }],
  },
]

export function OrderHistory() {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Історія замовлень</h2>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Замовлення {order.id}</CardTitle>
                  <span className="text-sm font-medium">{order.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Статус:</span>
                    <span>{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сума:</span>
                    <span>{order.total}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-muted-foreground">Товари:</span>
                    <ul className="mt-1">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">У вас ще немає замовлень</p>
      )}
    </div>
  )
}
