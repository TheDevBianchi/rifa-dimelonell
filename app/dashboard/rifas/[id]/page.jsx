"use client";

import { useParams } from "next/navigation";
import { useRaffles } from "@/hooks/useRaffles";
import { useState, useCallback, useEffect, useMemo, memo } from "react";
import { Loader2, Ticket, Edit, Search } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditForm from "@/components/dashboard/forms/EditForm";
import TicketGrid from "@/components/rifas/ticket-grid";
import StatsCard from "@/components/dashboard/stats-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Crear un TicketGrid memorizado
const MemoizedTicketGrid = memo(TicketGrid);

export default function RaffleDetailsPage() {
  const { id } = useParams();
  const { getRaffleById, unreserveTickets } = useRaffles();
  const [raffle, setRaffle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTicket, setSearchTicket] = useState("");
  const [highlightedTicket, setHighlightedTicket] = useState(null);

  const loadRaffle = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getRaffleById(id);
      setRaffle(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al cargar la rifa");
    } finally {
      setIsLoading(false);
    }
  }, [id, getRaffleById]);

  useEffect(() => {
    loadRaffle();
  }, [loadRaffle]);

  const progress = useMemo(() => {
    if (!raffle) return 0;
    return ((raffle.soldTickets?.length || 0) / raffle.totalTickets) * 100;
  }, [raffle]);

  const handleTicketClick = (ticketNumber) => {
    console.log("Ticket clicked:", ticketNumber);
  };

  const handleUnreserveTicket = async (ticketNumber) => {
    try {
      await unreserveTickets(raffle.id, [ticketNumber]);
      toast.success("Ticket liberado exitosamente");
      loadRaffle(); // Reload the raffle data
    } catch (error) {
      toast.error("Error al liberar el ticket");
      console.error(error);
    }
  };

  // Optimizar el manejador de búsqueda
  const handleSearchTicket = useCallback((e) => {
    e?.preventDefault();
    
    const ticketNumber = parseInt(searchTicket, 10);
    if (isNaN(ticketNumber) || ticketNumber < 1 || ticketNumber > raffle?.totalTickets) {
      toast.error("Por favor ingresa un número de ticket válido");
      return;
    }

    // Ajustar el número para que coincida con el índice (0-based)
    const adjustedNumber = ticketNumber;
    setHighlightedTicket(adjustedNumber);
    
    const ticketElement = document.getElementById(`ticket-${adjustedNumber}`);
    if (ticketElement) {
      ticketElement.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
      
      // Resaltar el ticket
      ticketElement.classList.add("ring-4", "ring-primary", "ring-opacity-75");
      const timeoutId = setTimeout(() => {
        ticketElement.classList.remove("ring-4", "ring-primary", "ring-opacity-75");
        setHighlightedTicket(null);
      }, 4000);

      return () => clearTimeout(timeoutId);
    } else {
      toast.error("Ticket no encontrado");
    }
  }, [searchTicket, raffle?.totalTickets]);

  // Memoizar el manejador del cambio del input
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    // Validar que solo se ingresen números
    if (value === '' || /^\d+$/.test(value)) {
      setSearchTicket(value);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-gray-400">Cargando detalles de la rifa...</p>
        </div>
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">No se encontró la rifa</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Agregar el buscador fijo aquí, fuera de las tabs */}
      <div className="fixed bottom-4 right-4 z-50 bg-principal-200 backdrop-blur-lg p-3 rounded-lg border border-secondary shadow-md">
        <form 
          onSubmit={handleSearchTicket} 
          className="flex items-center gap-2"
        >
          <div className="flex flex-col">
            <label htmlFor="ticket-search" className="text-xs text-gray-400 mb-1">
              Buscar Ticket
            </label>
            <Input
              id="ticket-search"
              type="number"
              placeholder="Ej: 1234"
              value={searchTicket}
              onChange={handleSearchChange}
              className="w-32 bg-principal-300/40 border-secondary focus:border-accent focus:ring-accent/30"
              min={1}
              max={raffle?.totalTickets}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="hover:bg-accent/20 border-secondary mt-6"
          >
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="bg-principal-300/40 border border-secondary backdrop-blur-xl">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-accent data-[state=active]:text-white hover:bg-accent/20 transition-colors"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Detalles y Tickets
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-accent data-[state=active]:text-white hover:bg-accent/20 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Rifa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="bg-principal-200 backdrop-blur-xl border border-secondary shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">
                {raffle.title}
              </CardTitle>
              <div className="bg-principal-300/40 p-6 rounded-xl border border-secondary/20">
                <p className="text-secondary-700 leading-relaxed whitespace-pre-line">
                  {raffle.description}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progreso de Ventas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary">
                  Progreso de Ventas
                </h3>
                <Progress value={progress} className="h-2 bg-principal-300/40 border border-secondary/20" />
                <div className="grid grid-cols-3 gap-4">
                  <StatsCard
                    title="Tickets Vendidos"
                    value={raffle.soldTickets?.length || 0}
                    total={raffle.totalTickets}
                    className="bg-principal-300/40 border-secondary hover:border-accent transition-all"
                  />
                  <StatsCard
                    title="Tickets Reservados"
                    value={raffle.reservedTickets?.length || 0}
                    total={raffle.totalTickets}
                    className="bg-principal-300/40 border-secondary hover:border-accent transition-all"
                  />
                  <StatsCard
                    title="Tickets Disponibles"
                    value={
                      raffle.totalTickets -
                      (raffle.soldTickets?.length || 0) -
                      (raffle.reservedTickets?.length || 0)
                    }
                    total={raffle.totalTickets}
                    className="bg-principal-300/40 border-secondary hover:border-accent transition-all"
                  />
                </div>
              </div>

              {/* Detalles Financieros */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary/20">
                <div>
                  <h3 className="font-medium text-secondary-600">
                    Precio por Ticket
                  </h3>
                  <p className="text-xl font-bold text-accent">
                    ${raffle.price} COP
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-secondary-600">Total Recaudado</h3>
                  <p className="text-xl font-bold text-accent">
                    ${(raffle.soldTickets?.length || 0) * raffle.price} COP
                  </p>
                </div>
              </div>

              {/* Grid de Tickets - Eliminar el buscador de aquí */}
              <div className="pt-6 border-t border-secondary/20">
                <h3 className="text-lg font-semibold text-secondary mb-4">Estado de Tickets</h3>
                <MemoizedTicketGrid
                  totalTickets={raffle.totalTickets}
                  soldTickets={raffle.soldTickets || []}
                  reservedTickets={raffle.reservedTickets || []}
                  selectedTickets={[]}
                  onTicketClick={handleTicketClick}
                  isDashboard={true}
                  randomTickets={raffle.randomTickets}
                  users={raffle.users || []}
                  onUnreserveTicket={handleUnreserveTicket}
                  highlightedTicket={highlightedTicket}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <EditForm raffle={raffle} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
