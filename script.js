const fs = require("fs");
let content = fs.readFileSync("c:\\Users\\neha2\\AppData\\Roaming\\Code\\User\\workspaceStorage\\ce6e58ffc29085ed18876a73926d14d2\\GitHub.copilot-chat\\chat-session-resources\\05b13adb-6d12-44ae-9730-bd7b6f2074ba\\call_MHxleFJscHhBdTVqV0xaYUxEbUM__vscode-1775727386153\\content.txt", "utf8");

// Parse CSV logic:
content = content.replace(
  "import { Trash2, Edit, Plus } from 'lucide-react';",
  "import { Trash2, Edit, Plus, Upload, ChevronDown, ChevronRight, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';\nimport Papa from 'papaparse';"
);

// State insertion:
const stateInject = `
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const groupedProducts = products.reduce((acc: any, product: any) => {
    const cat = product.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) {
      setProducts(products.map((p: any) => p.id === id ? { ...p, is_active: !currentStatus } : p));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        // Map rows to Supabase rows
        const productsToInsert = rows.map(row => ({
          name: row.name || "Untitled",
          description: row.description || "",
          price: parseFloat(row.price) || 0,
          category: row.category || "Fashion",
          amazon_link: row.amazon_link || "",
          badge: row.badge || null,
          user_id: products[0]?.user_id || "", 
          is_active: true
        }));

        if (productsToInsert.length > 0) {
          const { data, error } = await supabase.from("products").insert(productsToInsert).select();
          if (error) {
            alert("Upload failed: " + error.message);
          } else if (data) {
            setProducts([...data, ...products]);
            alert("CSV Upload successful!");
          }
        }
      },
      error: (error) => {
        alert("Failed to parse CSV: " + error.message);
      }
    });

    // clear the file input
    event.target.value = "";
  };
`;

content = content.replace(
  "const [isSubmitting, setIsSubmitting] = useState(false);",
  "const [isSubmitting, setIsSubmitting] = useState(false);\n" + stateInject
);

// Table replacement:
const newTable = `
        {/* CSV Bulk Upload Section */}
        <div className="mb-4 p-4 border border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">CSV Bulk Upload</h3>
            <p className="text-xs text-gray-500 mt-1">Import products with columns: <code className="bg-gray-200 px-1 rounded">name, description, price, category, amazon_link, badge</code></p>
          </div>
          <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 transition ml-4 shrink-0 shadow-sm">
            <Upload size={16} /> Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4 bg-white mb-6">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="p-8 text-center text-gray-500 border border-gray-200 rounded">No products found.</div>
          ) : (
            <div className="rounded-lg overflow-hidden shadow-sm">
              {Object.keys(groupedProducts).map((cat, idx) => (
                <div key={cat} className={idx !== 0 ? "border-t border-gray-200" : ""}>
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategory(cat)}
                    className="bg-gray-50 hover:bg-blue-50 p-4 flex items-center justify-between cursor-pointer font-bold text-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {expandedCategories[cat] ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronRight size={18} className="text-gray-500" />}
                      {cat} <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm ml-2 border border-gray-200">{groupedProducts[cat].length}</span>
                    </div>
                  </div>

                  {/* Section Products */}
                  {expandedCategories[cat] && (
                    <table className="w-full text-left bg-white text-sm border-t border-gray-200">
                      <thead className="bg-white">
                        <tr>
                          <th className="p-3 w-[70px] text-gray-400 font-medium text-xs tracking-wider uppercase">Media</th>
                          <th className="p-3 text-gray-400 font-medium text-xs tracking-wider uppercase">Info</th>
                          <th className="p-3 text-gray-400 font-medium text-xs tracking-wider uppercase">Price</th>
                          <th className="p-3 text-center text-gray-400 font-medium text-xs tracking-wider uppercase">Visibility</th>
                          <th className="p-3 text-right text-gray-400 font-medium text-xs tracking-wider uppercase">Tools</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {groupedProducts[cat].map((p: any) => (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-3">
                              {p.media_gallery && p.media_gallery.length > 0 ? (
                                <img src={p.media_gallery[0].url} alt={p.name} className="w-10 h-10 object-cover rounded shadow-sm border border-gray-200" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 border border-gray-200">
                                  <ImageIcon size={16} />
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="font-semibold max-w-[250px] truncate text-gray-900 leading-tight">{p.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[250px] mt-1 flex items-center gap-1">
                                {p.badge && <span className="text-[9px] font-bold text-white bg-red-500 px-1.5 rounded uppercase tracking-wider">{p.badge}</span>}
                                {p.amazon_link && new URL(p.amazon_link).hostname.replace("www.", "")}
                              </div>
                            </td>
                            <td className="p-3 font-medium text-gray-800 align-middle">₹{p.price}</td>
                            <td className="p-3 text-center align-middle">
                               <button 
                                 onClick={() => toggleActiveStatus(p.id, p.is_active)}
                                 className={\`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center min-w-[85px] gap-1.5 mx-auto transition-colors shadow-sm cursor-pointer \${p.is_active ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"}\`}
                               >
                                 {p.is_active ? <><Eye size={12} className="text-green-600"/> Active</> : <><EyeOff size={12} className="text-gray-500"/> Hidden</>}
                               </button>
                            </td>
                            <td className="p-3">
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal(p)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-md transition-colors" title="Edit">
                                  <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(p.id, p.media_gallery || [])} className="text-red-500 hover:bg-red-100 p-2 rounded-md transition-colors" title="Delete">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
`;

const tableStart = content.indexOf('<div className="overflow-x-auto">');
const tableEndStr = '</table>\n        </div>';
const tableEnd = content.indexOf(tableEndStr, tableStart) + tableEndStr.length;

if (tableStart !== -1 && tableEnd !== -1) {
  content = content.substring(0, tableStart) + newTable + content.substring(tableEnd);
  fs.writeFileSync("app/admin/DashboardClient.tsx", content);
  console.log("Updated DashboardClient.tsx successfully");
} else {
  console.log("Could not locate table boundaries in original file.");
  fs.writeFileSync("app/admin/DashboardClient.tsx", content);
}
