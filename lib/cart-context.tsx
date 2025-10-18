"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getProductById } from "./products-data"

export interface CartItem {
  id: number
  name: string
  origin: string
  price: number
  quantity: number
  image: string
  roastLevel: string
  weight: string
  stockCount: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("aromabyte-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aromabyte-cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (productId: number, quantity: number) => {
    const product = getProductById(productId)
    if (!product) return

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === productId)

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stockCount) {
          alert(`Solo hay ${product.stockCount} unidades disponibles de ${product.name}`)
          return currentItems.map((item) => (item.id === productId ? { ...item, quantity: product.stockCount } : item))
        }
        return currentItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      } else {
        if (quantity > product.stockCount) {
          alert(`Solo hay ${product.stockCount} unidades disponibles de ${product.name}`)
          quantity = product.stockCount
        }

        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          origin: product.origin,
          price: product.price,
          quantity,
          image: product.images[0],
          roastLevel: product.roastLevel,
          weight: product.specifications.weight,
          stockCount: product.stockCount,
        }
        return [...currentItems, newItem]
      }
    })
  }

  const removeItem = (productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    const product = getProductById(productId)
    if (product && quantity > product.stockCount) {
      alert(`Solo hay ${product.stockCount} unidades disponibles de ${product.name}`)
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === productId ? { ...item, quantity: product.stockCount } : item)),
      )
      return
    }

    setItems((currentItems) => currentItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
