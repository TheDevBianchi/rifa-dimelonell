"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, Ticket, User, Calendar, Gift, Settings, Filter, Users, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function WinnerSelector() {
  const [raffles, setRaffles] = useState([]);
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [raffleData, setRaffleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const rouletteRef = useRef(null);
  
  // Parámetros ajustables para la selección
  const [minTicketsRequired, setMinTicketsRequired] = useState(1);
  const [weightByTickets, setWeightByTickets] = useState(true); // Si es true, usuarios con más tickets tienen más probabilidades
  const [excludePreviousWinners, setExcludePreviousWinners] = useState(false);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  
  // Parámetros de rango de fechas
  const [useDataRange, setUseDataRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch all raffles
  useEffect(() => {
    const fetchRaffles = async () => {
      setIsLoading(true);
      try {
        const rafflesCollection = collection(db, "raffles");
        const raffleSnapshot = await getDocs(rafflesCollection);
        const rafflesList = raffleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRaffles(rafflesList);
      } catch (error) {
        console.error("Error fetching raffles:", error);
        toast.error("Error al cargar las rifas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaffles();
  }, []);

  // Fetch selected raffle data
  useEffect(() => {
    const fetchRaffleData = async () => {
      if (!selectedRaffle) {
        setRaffleData(null);
        return;
      }

      setIsLoading(true);
      try {
        const raffleRef = doc(db, "raffles", selectedRaffle);
        const raffleDoc = await getDoc(raffleRef);

        if (raffleDoc.exists()) {
          const data = raffleDoc.data();
          setRaffleData({
            id: raffleDoc.id,
            ...data,
          });
        } else {
          toast.error("Rifa no encontrada");
          setRaffleData(null);
        }
      } catch (error) {
        console.error("Error fetching raffle data:", error);
        toast.error("Error al cargar los datos de la rifa");
        setRaffleData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaffleData();
  }, [selectedRaffle]);

  // Calcular usuarios elegibles basados en los parámetros
  useEffect(() => {
    if (!raffleData || !raffleData.users) {
      setEligibleUsers([]);
      return;
    }

    // Filtrar usuarios basados en los criterios
    const eligible = raffleData.users.filter(user => {
      // Verificar cantidad mínima de tickets
      const ticketCount = user.selectedTickets?.length || 0;
      if (ticketCount < minTicketsRequired) return false;
      
      // Excluir ganadores anteriores si está activada la opción
      if (excludePreviousWinners && 
          raffleData.winner && 
          raffleData.winner.user.email === user.email) {
        return false;
      }
      
      // Filtrar por rango de fechas si está activado
      if (useDataRange && (startDate || endDate)) {
        // Verificar si el usuario tiene fecha de compra
        if (!user.purchaseDate) return false;
        
        try {
          const purchaseDate = typeof user.purchaseDate === 'string' 
            ? parseISO(user.purchaseDate)
            : user.purchaseDate.toDate(); // Si es un timestamp de Firestore
          
          // Verificar si está dentro del rango de fechas
          if (startDate && isBefore(purchaseDate, startDate)) return false;
          if (endDate && isAfter(purchaseDate, endDate)) return false;
        } catch (error) {
          console.error("Error al procesar la fecha de compra:", error);
          return false;
        }
      }
      
      return true;
    });
    
    setEligibleUsers(eligible);
  }, [raffleData, minTicketsRequired, excludePreviousWinners, useDataRange, startDate, endDate]);

  // Function to select a random winner
  const selectWinner = () => {
    if (!raffleData || eligibleUsers.length === 0) {
      toast.error("No hay participantes elegibles en esta rifa");
      return;
    }

    setIsSelecting(true);
    setWinner(null);

    // Create a pool of tickets where each user appears based on configuration
    const ticketPool = [];
    
    if (weightByTickets) {
      // Modo ponderado: cada ticket cuenta como una entrada en la ruleta
      eligibleUsers.forEach(user => {
        if (user.selectedTickets && Array.isArray(user.selectedTickets)) {
          user.selectedTickets.forEach(ticket => {
            ticketPool.push({
              user: {
                name: user.name,
                email: user.email,
                phone: user.phone
              },
              ticket
            });
          });
        }
      });
    } else {
      // Modo equitativo: cada usuario tiene una sola entrada en la ruleta
      // independientemente de cuántos tickets haya comprado
      eligibleUsers.forEach(user => {
        if (user.selectedTickets && Array.isArray(user.selectedTickets) && user.selectedTickets.length > 0) {
          // Usamos el primer ticket del usuario para representarlo
          ticketPool.push({
            user: {
              name: user.name,
              email: user.email,
              phone: user.phone
            },
            ticket: user.selectedTickets[0]
          });
        }
      });
    }

    if (ticketPool.length === 0) {
      toast.error("No hay tickets válidos en esta rifa");
      setIsSelecting(false);
      return;
    }

    // Animate through random tickets before selecting winner
    let counter = 0;
    const maxIterations = 30; // Number of "spins" before stopping
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * ticketPool.length);
      const randomTicket = ticketPool[randomIndex];
      
      // Update the temporary selection
      setWinner({
        ...randomTicket,
        isTemp: true
      });
      
      counter++;
      
      // Stop after maxIterations
      if (counter >= maxIterations) {
        clearInterval(interval);
        
        // Set the final winner
        const winnerIndex = Math.floor(Math.random() * ticketPool.length);
        const finalWinner = ticketPool[winnerIndex];
        
        setWinner({
          ...finalWinner,
          isTemp: false,
          selectedAt: new Date().toISOString()
        });
        
        // Show confetti effect
        triggerConfetti();
        
        // Open dialog with winner details
        setIsDialogOpen(true);
        setIsSelecting(false);
        
        // Save winner to raffle document
        saveWinner(finalWinner);
      }
    }, 100); // Speed of the animation
  };

  // Save winner to Firestore
  const saveWinner = async (winnerData) => {
    try {
      const raffleRef = doc(db, "raffles", selectedRaffle);
      await updateDoc(raffleRef, {
        winner: {
          ...winnerData,
          selectedAt: new Date().toISOString()
        }
      });
      toast.success("Ganador guardado exitosamente");
    } catch (error) {
      console.error("Error saving winner:", error);
      toast.error("Error al guardar el ganador");
    }
  };

  // Trigger confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Selector de Ganador</h2>
          <p className="text-gray-400">Selecciona una rifa y elige un ganador aleatorio</p>
        </div>
        
        <div className="w-full md:w-64">
          <Select
            disabled={isLoading || isSelecting}
            value={selectedRaffle}
            onValueChange={setSelectedRaffle}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una rifa" />
            </SelectTrigger>
            <SelectContent>
              {raffles.map((raffle) => (
                <SelectItem key={raffle.id} value={raffle.id}>
                  {raffle.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && raffleData && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
          {/* Parámetros ajustables */}
          <Collapsible className="mb-6 border border-gray-700 rounded-lg overflow-hidden">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-900/50 hover:bg-gray-900/80 transition-colors">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium text-white">Parámetros de Selección</h3>
              </div>
              <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                {eligibleUsers.length} usuarios elegibles
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 bg-gray-900/30 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="min-tickets" className="text-sm text-gray-300 flex items-center gap-1">
                        <Ticket className="h-4 w-4 text-primary" />
                        Tickets mínimos requeridos
                      </Label>
                      <span className="text-primary font-medium">{minTicketsRequired}</span>
                    </div>
                    <Slider
                      id="min-tickets"
                      min={1}
                      max={10}
                      step={1}
                      value={[minTicketsRequired]}
                      onValueChange={(value) => setMinTicketsRequired(value[0])}
                      className="py-2"
                    />
                    <p className="text-xs text-gray-400">
                      Solo usuarios con {minTicketsRequired} o más tickets participarán en el sorteo
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="exclude-winners"
                      checked={excludePreviousWinners}
                      onCheckedChange={setExcludePreviousWinners}
                    />
                    <Label htmlFor="exclude-winners" className="text-sm text-gray-300 flex items-center gap-1">
                      <Filter className="h-4 w-4 text-yellow-400" />
                      Excluir ganadores anteriores
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300 flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-400" />
                      Modo de selección
                    </Label>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="weight-by-tickets"
                          checked={weightByTickets}
                          onCheckedChange={setWeightByTickets}
                        />
                        <Label htmlFor="weight-by-tickets" className="text-sm text-gray-300">
                          Ponderar por cantidad de tickets
                        </Label>
                      </div>
                      <p className="text-xs text-gray-400">
                        {weightByTickets 
                          ? "Los usuarios con más tickets tienen más probabilidades de ganar" 
                          : "Todos los usuarios tienen la misma probabilidad de ganar, independientemente de cuántos tickets hayan comprado"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Filtro por rango de fechas */}
                <div className="col-span-1 md:col-span-2 space-y-4 pt-2 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-date-range"
                      checked={useDataRange}
                      onCheckedChange={setUseDataRange}
                    />
                    <Label htmlFor="use-date-range" className="text-sm text-gray-300 flex items-center gap-1">
                      <CalendarRange className="h-4 w-4 text-blue-400" />
                      Filtrar por rango de fechas
                    </Label>
                  </div>
                  
                  {useDataRange && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="start-date" className="text-xs text-gray-400">
                          Fecha de inicio
                        </Label>
                        <DatePicker 
                          date={startDate} 
                          setDate={setStartDate} 
                          placeholder="Desde"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-date" className="text-xs text-gray-400">
                          Fecha de fin
                        </Label>
                        <DatePicker 
                          date={endDate} 
                          setDate={setEndDate} 
                          placeholder="Hasta"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-xs text-gray-400">
                          Solo se incluirán usuarios que hayan comprado tickets dentro del rango de fechas seleccionado.
                          {startDate && !endDate && " Solo se incluirán compras realizadas desde " + format(startDate, "PPP", { locale: es }) + "."}
                          {!startDate && endDate && " Solo se incluirán compras realizadas hasta " + format(endDate, "PPP", { locale: es }) + "."}
                          {startDate && endDate && " Solo se incluirán compras realizadas entre " + format(startDate, "PPP", { locale: es }) + " y " + format(endDate, "PPP", { locale: es }) + "."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-medium text-white">Rifa</h3>
              </div>
              <p className="text-xl font-bold text-primary">{raffleData.title}</p>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="h-5 w-5 text-green-400" />
                <h3 className="text-lg font-medium text-white">Tickets Vendidos</h3>
              </div>
              <p className="text-xl font-bold text-primary">
                {raffleData.users?.reduce((total, user) => 
                  total + (user.selectedTickets?.length || 0), 0) || 0}
              </p>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Participantes</h3>
              </div>
              <p className="text-xl font-bold text-primary">
                {raffleData.users?.length || 0}
              </p>
            </div>
          </div>

          {/* Winner display area */}
          <div 
            ref={rouletteRef}
            className="relative bg-gray-900 border-2 border-primary/30 rounded-xl p-8 mb-6 min-h-[200px] flex flex-col items-center justify-center overflow-hidden"
          >
            {winner ? (
              <div className={`text-center transition-all duration-300 ${winner.isTemp ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                <div className="inline-block p-3 bg-primary/20 rounded-full mb-4">
                  <Trophy className="h-12 w-12 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {winner.user.name}
                </h3>
                <p className="text-gray-300 mb-1">
                  {winner.user.email}
                </p>
                <p className="text-gray-400 mb-4">
                  {winner.user.phone}
                </p>
                <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                  <span className="text-lg font-bold text-primary">
                    Ticket #{winner.ticket}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Gift className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  {isSelecting 
                    ? "Seleccionando ganador..." 
                    : "Presiona el botón para seleccionar un ganador aleatorio"}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              disabled={isLoading || isSelecting || raffleData.users?.length === 0}
              onClick={selectWinner}
              className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 text-black font-bold py-6 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSelecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Seleccionando...
                </>
              ) : (
                <>
                  <Trophy className="mr-2 h-5 w-5" />
                  Seleccionar Ganador
                </>
              )}
            </Button>
          </div>

          {/* Previous winner (if exists) */}
          {raffleData.winner && !isSelecting && !winner && (
            <div className="mt-8 p-4 border border-yellow-500/30 bg-yellow-500/10 rounded-lg">
              <h3 className="flex items-center gap-2 text-lg font-medium text-yellow-400 mb-3">
                <Trophy className="h-5 w-5" />
                Ganador Anterior
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Nombre:</p>
                  <p className="text-white font-medium">{raffleData.winner.user.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ticket:</p>
                  <p className="text-primary font-medium">#{raffleData.winner.ticket}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email:</p>
                  <p className="text-white">{raffleData.winner.user.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Teléfono:</p>
                  <p className="text-white">{raffleData.winner.user.phone}</p>
                </div>
                {raffleData.winner.selectedAt && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Seleccionado el:
                    </p>
                    <p className="text-gray-300">
                      {new Date(raffleData.winner.selectedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Winner Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-primary">
              ¡Tenemos un Ganador!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              El ganador ha sido seleccionado aleatoriamente entre todos los tickets vendidos.
            </DialogDescription>
          </DialogHeader>

          {winner && !winner.isTemp && (
            <div className="py-4 text-center">
              <div className="inline-block p-3 bg-primary/20 rounded-full mb-4">
                <Trophy className="h-12 w-12 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {winner.user.name}
              </h3>
              <p className="text-gray-300 mb-1">
                {winner.user.email}
              </p>
              <p className="text-gray-400 mb-4">
                {winner.user.phone}
              </p>
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                <span className="text-lg font-bold text-primary">
                  Ticket #{winner.ticket}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              onClick={() => setIsDialogOpen(false)}
              className="w-full"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
