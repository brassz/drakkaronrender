import { DatabaseService } from "@/lib/database-service"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { enginePackages, hullColors, upholsteryPackages, additionalOptions, boatModels, dealers, orders, mode, singleItem } =
      await req.json()

    // Se é um item único, salva e retorna com ID
    if (singleItem) {
      const { type, item } = singleItem
      
      let savedItem
      switch (type) {
        case "engines":
          await DatabaseService.saveEnginePackages([item])
          // Busca o item pelo display_order específico
          const engines = await DatabaseService.getEnginePackages()
          savedItem = engines.find(e => e.display_order === item.display_order && 
            e.name === item.name) || engines[engines.length - 1]
          break
        case "hulls":
          await DatabaseService.saveHullColors([item])
          const hulls = await DatabaseService.getHullColors()
          savedItem = hulls.find(h => h.display_order === item.display_order && 
            h.name === item.name) || hulls[hulls.length - 1]
          break
        case "upholstery":
          await DatabaseService.saveUpholsteryPackages([item])
          const upholstery = await DatabaseService.getUpholsteryPackages()
          savedItem = upholstery.find(u => u.display_order === item.display_order && 
            u.name === item.name) || upholstery[upholstery.length - 1]
          break
        case "options":
          await DatabaseService.saveAdditionalOptions([item])
          const options = await DatabaseService.getAdditionalOptions()
          savedItem = options.find(o => o.display_order === item.display_order && 
            o.name === item.name) || options[options.length - 1]
          break
        case "models":
          await DatabaseService.saveBoatModels([item])
          const models = await DatabaseService.getBoatModels()
          savedItem = models.find(m => m.display_order === item.display_order && 
            m.name === item.name) || models[models.length - 1]
          break
        case "dealers":
          await DatabaseService.saveDealers([item])
          const dealers = await DatabaseService.getDealers()
          savedItem = dealers.find(d => d.display_order === item.display_order && 
            d.name === item.name && d.email === item.email) || dealers[dealers.length - 1]
          break
        default:
          throw new Error("Tipo inválido")
      }

      return NextResponse.json({ success: true, savedItem })
    }

    if (mode === "upsert") {
      const promises = []
      if (enginePackages) promises.push(DatabaseService.saveEnginePackages(enginePackages))
      if (hullColors) promises.push(DatabaseService.saveHullColors(hullColors))
      if (upholsteryPackages) promises.push(DatabaseService.saveUpholsteryPackages(upholsteryPackages))
      if (additionalOptions) promises.push(DatabaseService.saveAdditionalOptions(additionalOptions))
      if (boatModels) promises.push(DatabaseService.saveBoatModels(boatModels))
      if (dealers) promises.push(DatabaseService.saveDealers(dealers))
      if (orders) promises.push(DatabaseService.saveOrders(orders))

      await Promise.all(promises)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Save admin data error:", errorMessage)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
