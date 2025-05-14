// components/promos/PromoModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { getRaffles } from "@/app/dashboard/compras/actions";
import { useState, useEffect } from "react"; // At the top of the file
import { Controller } from "react-hook-form"; // Import Controller
import { Tag, Percent, Package, ArrowDownCircle, Edit, PlusCircle } from 'lucide-react'; // Import icons
import { createPromotion, updatePromotion } from '@/utils/firebase/promoService'; // Importar funciones de Firebase
import { toast } from 'sonner'; // Para notificaciones

export function PromoModal({ isOpen, onClose, raffleId, promotion, onPromotionSaved }) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
        getValues,
    } = useForm(); // Add control and watch
    const isEditing = !!promotion;
    const discountType = watch("discountType"); // Watch the discountType field
    const [raffles, setRaffles] = useState([]);
    const [loading, setLoading] = useState(false); // Estado para controlar la carga

    useEffect(() => {
        const fetchRaffles = async () => {
        const { raffles, success } = await getRaffles();
        if (success) {
            setRaffles(raffles);
        }
        };
        fetchRaffles();
    }, []);

    useEffect(() => {
        // (Keep the existing useEffect logic for resetting the form)
         if (isOpen && isEditing) {
             reset({
                 name: promotion.name,
                 raffleId: promotion.raffleId || raffleId,
                 discountType: promotion.discountType,
                 discountValue: promotion.discountValue,
                 minTickets: promotion.minTickets,
                 packagePrice: promotion.packagePrice,
                 newTicketPrice: promotion.newTicketPrice,
             });
         } else if (isOpen) {
             reset({
                 raffleId: raffleId || '',
                 name: '',
                 discountType: '',
                 discountValue: '',
                 minTickets: '',
                 packagePrice: '',
                 newTicketPrice: '',
             });
         }
    }, [isOpen, isEditing, promotion, reset, raffleId]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            
            // Preparar los datos según el tipo de descuento
            const promoData = {
                name: data.name,
                raffleId: data.raffleId,
                discountType: data.discountType,
            };
            
            // Agregar campos específicos según el tipo de descuento
            if (data.discountType === 'percentage') {
                promoData.discountValue = data.discountValue;
            } else if (data.discountType === 'lower_cost') {
                promoData.newTicketPrice = data.newTicketPrice;
            } else if (data.discountType === 'package') {
                promoData.minTickets = data.minTickets;
                promoData.packagePrice = data.packagePrice;
            }
            
            let result;
            
            if (isEditing) {
                // Actualizar promoción existente
                result = await updatePromotion(promotion.id, promoData);
            } else {
                // Crear nueva promoción
                result = await createPromotion(promoData);
            }
            
            if (result.success) {
                toast.success(result.message);
                // Notificar al componente padre que se guardó la promoción
                if (onPromotionSaved) {
                    onPromotionSaved();
                }
                onClose(); // Cerrar el modal
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error al guardar promoción:', error);
            toast.error('Error al guardar la promoción: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white"> {/* Adjusted max-width and styling */}
            <DialogHeader className="mb-4"> {/* Added margin bottom */}
                <DialogTitle className="flex items-center text-xl font-semibold"> {/* Flex for icon alignment */}
                    {isEditing ? <Edit className="mr-2 h-5 w-5 text-blue-400" /> : <PlusCircle className="mr-2 h-5 w-5 text-green-400" />}
                    {isEditing ? "Editar Promoción" : "Crear Nueva Promoción"}
                </DialogTitle>
            <DialogDescription className="text-gray-400">
                {isEditing
                ? "Modifica los detalles de la promoción existente."
                : "Define los detalles para una nueva promoción."}
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> {/* Increased vertical spacing */}
                {/* General Promotion Details */}
                <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50"> {/* Grouping wrapper */}
                     <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2"> {/* Adjusted gap */}
                        <Label htmlFor="name" className="text-right col-span-1 text-sm text-gray-300">
                            Nombre
                        </Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'El nombre es requerido' })}
                            className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                             placeholder="Ej: Promo Verano"
                        />
                        {errors.name && <p className="col-span-full text-red-400 text-xs mt-1 text-right">{errors.name.message}</p>} {/* Adjusted error styling */}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                        <Label htmlFor="raffleId" className="text-right col-span-1 text-sm text-gray-300">
                            Rifa
                        </Label>
                         <Controller
                            name="raffleId"
                            control={control}
                            rules={{ required: 'Seleccionar una rifa es requerido' }}
                            defaultValue={raffleId || (isEditing ? promotion?.raffleId : '')}
                            render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value || ''}
                                disabled={!!raffleId && !isEditing}
                            >
                                <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 [&>svg]:text-gray-400">
                                <SelectValue placeholder="Selecciona una rifa" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    {raffles.map((raffle) => (
                                        <SelectItem key={raffle.id} value={raffle.id} className="hover:bg-gray-700 focus:bg-gray-700">
                                            {raffle.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            )}
                        />
                        {errors.raffleId && <p className="col-span-full text-red-400 text-xs mt-1 text-right">{errors.raffleId.message}</p>}
                    </div>
                </div>

                {/* Discount Type and Conditional Fields */}
                <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50"> {/* Grouping wrapper */}
                    <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                        <Label htmlFor="discountType" className="text-right col-span-1 text-sm text-gray-300">
                            Tipo Descuento
                        </Label>
                         <Controller
                            name="discountType"
                            control={control}
                            defaultValue={isEditing ? promotion?.discountType : ""}
                            rules={{ required: "El tipo de descuento es requerido" }}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => { /* Keep reset logic */
                                        field.onChange(value);
                                        reset({
                                            ...getValues(),
                                            discountType: value,
                                            discountValue: '', minTickets: '', packagePrice: '', newTicketPrice: ''
                                        });
                                    }}
                                    value={field.value || ''}
                                >
                                <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 [&>svg]:text-gray-400">
                                    <SelectValue placeholder="Selecciona tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="percentage" className="hover:bg-gray-700 focus:bg-gray-700"><Percent className="inline h-4 w-4 mr-2 text-yellow-400"/>Porcentaje (%)</SelectItem>
                                    <SelectItem value="lower_cost" className="hover:bg-gray-700 focus:bg-gray-700"><ArrowDownCircle className="inline h-4 w-4 mr-2 text-red-400"/>Bajar Coste Tickets</SelectItem>
                                    <SelectItem value="package" className="hover:bg-gray-700 focus:bg-gray-700"><Package className="inline h-4 w-4 mr-2 text-green-400"/>Paquete Boletos</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.discountType && <p className="col-span-full text-red-400 text-xs mt-1 text-right">{errors.discountType.message}</p>}
                    </div>

                    {/* Conditional Fields Area */}
                    <div className="space-y-4 mt-4 pl-4 border-l-2 border-blue-500/50"> {/* Indented and bordered area */}
                        {discountType === 'percentage' && (
                            <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                <Label htmlFor="discountValue" className="text-right col-span-1 text-sm text-gray-300">
                                    Porcentaje (%)
                                </Label>
                                <Input
                                    id="discountValue" type="number" placeholder="Ej: 10"
                                    {...register('discountValue', { /* Keep validation */
                                         required: 'El porcentaje es requerido', valueAsNumber: true,
                                         min: { value: 1, message: 'El porcentaje debe ser positivo' },
                                         max: { value: 99, message: 'El porcentaje debe ser menor a 100' }
                                     })}
                                    className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.discountValue && <p className="col-span-full text-red-400 text-xs mt-1 text-right">{errors.discountValue.message}</p>}
                            </div>
                        )}

                        {discountType === 'lower_cost' && (
                             <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                <Label htmlFor="newTicketPrice" className="text-right col-span-1 text-sm text-gray-300">
                                    Nuevo Coste ($)
                                </Label>
                                <Input
                                    id="newTicketPrice" type="number" step="0.01" placeholder="Ej: 5.00"
                                    {...register('newTicketPrice', { /* Keep validation */
                                        required: 'El nuevo coste es requerido', valueAsNumber: true,
                                        min: { value: 0.01, message: 'El coste debe ser positivo' }
                                    })}
                                    className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.newTicketPrice && <p className="col-span-full text-red-400 text-xs mt-1 text-right">{errors.newTicketPrice.message}</p>}
                            </div>
                        )}

                        {discountType === 'package' && (
                            <>
                                 <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                    <Label htmlFor="minTickets" className="text-right col-span-1 text-sm text-gray-300">
                                        Tickets Mín.
                                    </Label>
                                    <Input
                                        id="minTickets" type="number" placeholder="Ej: 5"
                                        {...register('minTickets', { /* Keep validation */
                                            required: 'La cantidad mínima es requerida', valueAsNumber: true,
                                            min: { value: 2, message: 'Debe ser al menos 2 tickets' }
                                        })}
                                        className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.minTickets && <p className="col-span-full text-red-400 text-xs mt-1 text-right">{errors.minTickets.message}</p>}
                                </div>
                                 <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                                    <Label htmlFor="packagePrice" className="text-right col-span-1 text-sm text-gray-300">
                                        Precio Paquete ($)
                                    </Label>
                                    <Input
                                        id="packagePrice" type="number" step="0.01" placeholder="Ej: 20.00"
                                        {...register('packagePrice', { /* Keep validation */
                                            required: 'El precio del paquete es requerido', valueAsNumber: true,
                                            min: { value: 0.01, message: 'El precio debe ser positivo' }
                                        })}
                                        className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.packagePrice && <p className="col-span-full text-red-400 text-xs mt-1 text-right">{errors.packagePrice.message}</p>}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4"> {/* Added padding top */}
                    <Button type='button' variant='outline' onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" disabled={loading}>
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        className={`${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditing ? "Guardando..." : "Creando..."}
                            </span>
                        ) : (
                            isEditing ? "Guardar Cambios" : "Crear Promoción"
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
}