import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useEffect, useState } from "react";
import api, { storage } from "../../../services/api";
import { Pencil, Trash2, PlusCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";

interface Product {
  _id: string;
  title: string;
  description: string;
  productImage: string;
  category: { _id: string; name: string };
  detailsContent: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const { isOpen, openModal, closeModal } = useModal();
  const [isEdit, setIsEdit] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    detailsContent: "",
    productImage: null as File | null,
  });

  // ---------------------- DELETE MODAL STATES ----------------------
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ---------------------- FETCH PRODUCTS -----------------------
  const fetchProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to fetch products"));
  };

  // ---------------------- FETCH CATEGORIES -----------------------
  const fetchCategories = () => {
    api
      .get("/category")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ----------------------------- SAVE PRODUCT ---------------------------
  const handleSave = async (e: any) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v as any);
    });

    try {
      if (isEdit && editProduct) {
        await api.put(`/products/${editProduct._id}`, data);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", data);
        toast.success("Product added successfully");
      }

      closeModal();
      fetchProducts();
    } catch {
      toast.error("Failed to save product");
    }
  };

  // ----------------------------- DELETE PRODUCT --------------------------
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/products/${deleteId}`);
      toast.success("Deleted successfully");
      setDeleteModal(false);
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">All Products</h2>

        <button
          onClick={() => {
            setIsEdit(false);
            setForm({
              title: "",
              description: "",
              category: "",
              detailsContent: "",
              productImage: null,
            });
            openModal();
          }}
          className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle size={18} />
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-center">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200">
              <TableRow className="table-products">
                <TableCell isHeader>S.No</TableCell>
                <TableCell isHeader>Image</TableCell>
                <TableCell isHeader>Name</TableCell>
                <TableCell isHeader>Category</TableCell>
                <TableCell isHeader>Desc</TableCell>
                <TableCell isHeader>Long Desc</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.length > 0 ? (
                products.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell className="flex justify-center">
                      <img
                        src={`${storage}/${item.productImage}`}
                        className="w-25 h-20 rounded-md object-contain"
                      />
                    </TableCell>

                    <TableCell>{item.title}</TableCell>

                    <TableCell>
                      <Badge size="sm" color="success">
                        {item.category?.name}
                      </Badge>
                    </TableCell>

                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.detailsContent}</TableCell>

                    <TableCell className="flex items-center gap-3">
                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setEditProduct(item);
                          setForm({
                            title: item.title,
                            description: item.description,
                            category: item.category?._id,
                            detailsContent: item.detailsContent,
                            productImage: null,
                          });
                          openModal();
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => confirmDelete(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No Products Found
                </div>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* -------------------------- PRODUCT MODAL ----------------------------- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar product-modal relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h4>

          <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4">
            <div>
              <Label>Product Title</Label>
              <Input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                className="border p-2 rounded w-full"
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Details Content</Label>
              <textarea
                className="border p-2 rounded w-full"
                rows={8}
                value={form.detailsContent}
                onChange={(e) =>
                  setForm({ ...form, detailsContent: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Category</Label>
              <select
                className="border p-2 rounded w-full"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Choose Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Product Image</Label>
              <label className="border border-gray-300 p-4 rounded-lg flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50">
                <ImageIcon className="text-gray-500" size={40} />
                <span className="text-sm text-gray-600">
                  {form.productImage ? form.productImage.name : "Choose Image"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      productImage: e.target.files?.[0] || null,
                    })
                  }
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-sm"
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* -------------------------- DELETE CONFIRM MODAL ----------------------------- */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        className="max-w-[400px] m-4"
      >
        <div className="bg-white p-6 rounded-2xl text-center">
          <h4 className="text-xl font-semibold mb-2">Delete Product?</h4>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this product?
          </p>

          <div className="flex justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              className="bg-red-600 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
