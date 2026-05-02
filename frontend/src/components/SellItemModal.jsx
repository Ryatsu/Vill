// import { useState } from 'react'
// import { createSale } from '../api/saleApi'
// import RegisterModal from './RegisterModal'

// export default function SellItemModal({ items, onClose, addItem }) {
//   const [search, setSearch] = useState('')
//   const [selected, setSelected] = useState(null)
//   const [qty, setQty] = useState(1)
//   const [showRegister, setShowRegister] = useState(false)

//   const filtered = items.filter(i =>
//     i.name.toLowerCase().includes(search.toLowerCase())
//   )

//   const handleSell = async () => {
//     await createSale(selected.id, qty)
//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//       <div className="bg-white p-6 rounded w-96">

//         <h2 className="text-lg font-bold mb-3">Sell Item</h2>

//         {/* SEARCH */}
//         <input
//           className="w-full border p-2 mb-3"
//           placeholder="Search item..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value)
//             setSelected(null)
//           }}
//         />

//         {/* RESULTS */}
//         <div className="max-h-40 overflow-y-auto border mb-3">
//           {filtered.length > 0 ? (
//             filtered.map(item => (
//               <div
//                 key={item.id}
//                 onClick={() => setSelected(item)}
//                 className="p-2 hover:bg-gray-100 cursor-pointer"
//               >
//                 {item.name} - ₱{item.price}
//               </div>
//             ))
//           ) : (
//             <div className="p-3 text-center">
//               <p>No item found</p>
//               <button
//                 onClick={() => setShowRegister(true)}
//                 className="text-blue-500 underline"
//               >
//                 Register new item
//               </button>
//             </div>
//           )}
//         </div>

//         {/* SELECTED */}
//         {selected && (
//           <>
//             <p><strong>{selected.name}</strong></p>
//             <p>Price: ₱{selected.price}</p>

//             <input
//               type="number"
//               value={qty}
//               min="1"
//               onChange={(e) => setQty(Number(e.target.value))}
//               className="w-full border p-2 mt-2"
//             />

//             <p className="mt-2 font-bold">
//               Total: ₱{(selected.price * qty).toFixed(2)}
//             </p>

//             <button
//               onClick={handleSell}
//               className="w-full bg-green-500 text-white py-2 mt-3"
//             >
//               Confirm Sale
//             </button>
//           </>
//         )}

//         <button onClick={onClose} className="mt-3 text-sm">
//           Cancel
//         </button>

//         {/* REGISTER MODAL */}
//         {showRegister && (
//           <RegisterModal
//             onClose={() => setShowRegister(false)}
//             onSave={(item) => {
//               addItem(item)
//               setShowRegister(false)
//             }}
//           />
//         )}
//       </div>
//     </div>
//   )
// }