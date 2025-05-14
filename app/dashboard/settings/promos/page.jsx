// app/dashboard/settings/promos/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { PlusCircle, Tag, Package, Percent, ArrowDownCircle, Trash2, Edit } from 'lucide-react'
import { PromoModal } from '@/components/promos/PromoModal'; 
import { db } from '@/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { getAllPromotions, getPromotionsByRaffleId, deletePromotion, togglePromoStatus } from '@/utils/firebase/promoService';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function PromosPage () {
  const [raffles, setRaffles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRaffleId, setSelectedRaffleId] = useState(null) // To pre-select raffle in modal
  const [editingPromotion, setEditingPromotion] = useState(null) // State for promo being edited
  const [promotions, setPromotions] = useState([]) // State for all promotions
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false) // State for delete confirmation dialog
  const [promotionToDelete, setPromotionToDelete] = useState(null) // State for promotion to delete

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch raffles
        const rafflesCollection = collection(db, 'raffles')
        const raffleSnapshot = await getDocs(rafflesCollection)
        const rafflesList = raffleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setRaffles(rafflesList)
        
        // Fetch all promotions
        const result = await getAllPromotions()
        if (result.success) {
          setPromotions(result.promotions)
        } else {
          console.error('Error fetching promotions:', result.message)
          toast.error('Error al cargar promociones')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Error al cargar datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleOpenCreateModal = (raffleId = null) => {
    setSelectedRaffleId(raffleId);
    setEditingPromotion(null); // Ensure we are in create mode
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promotion) => {
    setSelectedRaffleId(promotion.raffleId);
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRaffleId(null);
    setEditingPromotion(null);
  };

  const handlePromotionSaved = async () => {
    // Refetch promotions after saving
    const result = await getAllPromotions();
    if (result.success) {
      setPromotions(result.promotions);
      toast.success('Promociones actualizadas');
    }
  };

  const handleDeletePromotion = (promotion) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePromotion = async () => {
    if (!promotionToDelete) return;
    
    try {
      const result = await deletePromotion(promotionToDelete.id);
      if (result.success) {
        // Remove from state
        setPromotions(promotions.filter(p => p.id !== promotionToDelete.id));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('Error al eliminar la promoción');
    } finally {
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
    }
  };

  const handleTogglePromoStatus = async (promotion) => {
    try {
      const newStatus = !promotion.active;
      const result = await togglePromoStatus(promotion.id, newStatus);
      
      if (result.success) {
        // Update in state
        setPromotions(promotions.map(p => 
          p.id === promotion.id ? {...p, active: newStatus} : p
        ));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error toggling promotion status:', error);
      toast.error('Error al cambiar el estado de la promoción');
    }
  };

  // Filter promotions by raffle ID
  const getPromotionsByRaffle = (raffleId) => {
    return promotions.filter(promo => promo.raffleId === raffleId);
  };

  // Helper function to render promotion details based on type
  const renderPromoDetails = (promo) => {
    switch (promo.discountType) {
      case 'percentage':
        return (
          <div className="flex items-center">
            <Percent className="h-4 w-4 mr-2 text-yellow-400" />
            <span>{promo.discountValue}% de descuento</span>
          </div>
        );
      case 'lower_cost':
        return (
          <div className="flex items-center">
            <ArrowDownCircle className="h-4 w-4 mr-2 text-red-400" />
            <span>Precio reducido: ${promo.newTicketPrice}</span>
          </div>
        );
      case 'package':
        return (
          <div className="flex items-center">
            <Package className="h-4 w-4 mr-2 text-green-400" />
            <span>{promo.minTickets} tickets por ${promo.packagePrice}</span>
          </div>
        );
      default:
        return <span>Tipo de promoción desconocido</span>;
    }
  };

  return (
    <div className='container mx-auto py-8 px-4 md:px-6 bg-principal-200'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-secondary border-b border-secondary pb-2'>
          Gestión de Promociones
        </h1>
        <Button onClick={() => handleOpenCreateModal()} className='bg-accent hover:bg-accent/90 text-white'>
          <PlusCircle className='mr-2 h-4 w-4' /> Crear Promoción
        </Button>
      </div>

      {loading ? (
        <div className='text-center py-10'>
          <p className='text-secondary'>Cargando datos...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {raffles.map((raffle) => {
            const rafflePromos = getPromotionsByRaffle(raffle.id);
            return (
              <div
                key={raffle.id}
                className='bg-principal-100 border border-secondary rounded-lg p-6 shadow-md'
              >
                <h2 className='text-xl font-semibold text-secondary mb-2 flex justify-between items-center'>
                  <span>{raffle.title}</span>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-accent text-accent">
                    ${raffle.ticketPrice} / ticket
                  </Badge>
                </h2>
                
                <div className='space-y-4 mt-4'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-sm font-medium text-secondary-600'>Promociones</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs hover:bg-accent/10 text-secondary hover:text-accent" 
                      onClick={() => handleOpenCreateModal(raffle.id)}
                    >
                      <PlusCircle className='mr-1 h-3 w-3' /> Agregar
                    </Button>
                  </div>
                  
                  {rafflePromos.length > 0 ? (
                    <div className='space-y-3'>
                      {rafflePromos.map((promo) => (
                        <div 
                          key={promo.id} 
                          className={`flex justify-between items-center p-3 rounded-md border ${promo.active ? 'bg-principal-300/50 border-secondary' : 'bg-principal-300/20 border-secondary/30 opacity-60'}`}
                        >
                          <div className='space-y-1'>
                            <div className='flex items-center'>
                              <span className='font-medium text-secondary mr-2'>{promo.name}</span>
                              {!promo.active && (
                                <Badge variant="outline" className="text-xs bg-principal-300 text-secondary-600 border-secondary/30">
                                  Inactiva
                                </Badge>
                              )}
                            </div>
                            <div className='text-sm text-secondary-600'>
                              {renderPromoDetails(promo)}
                            </div>
                          </div>
                          
                          <div className='flex space-x-1'>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-secondary-600 hover:text-accent hover:bg-principal-300/50"
                              onClick={() => handleTogglePromoStatus(promo)}
                              title={promo.active ? "Desactivar" : "Activar"}
                            >
                              <span className="sr-only">{promo.active ? "Desactivar" : "Activar"}</span>
                              {promo.active ? "🔴" : "🟢"}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-accent hover:text-accent/80 hover:bg-principal-300/50"
                              onClick={() => handleOpenEditModal(promo)}
                            >
                              <span className="sr-only">Editar</span>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-accent hover:text-accent/80 hover:bg-principal-300/50"
                              onClick={() => handleDeletePromotion(promo)}
                            >
                              <span className="sr-only">Eliminar</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-secondary-600 text-sm py-3 text-center border border-dashed border-secondary/30 rounded-md'>
                      No hay promociones configuradas para esta rifa.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Render the Modal */}
      <PromoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        raffleId={selectedRaffleId}
        promotion={editingPromotion}
        onPromotionSaved={handlePromotionSaved}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-principal-200 border-secondary text-secondary">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription className="text-secondary-600">
              Esta acción eliminará permanentemente la promoción &quot;{promotionToDelete?.name}&quot; y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-principal-300 text-secondary border-secondary hover:bg-principal-400 hover:text-secondary">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-accent text-white hover:bg-accent/80"
              onClick={confirmDeletePromotion}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}