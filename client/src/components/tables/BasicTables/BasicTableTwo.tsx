import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";

// ------------------------------- TYPES -------------------------------
interface Category {
  _id: string;
  name: string;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { isOpen, openModal, closeModal } = useModal();

  // Edit modal states
  const [isEdit, setIsEdit] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "" });

  // Delete modal states
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ---------------------- FETCH CATEGORIES -----------------------
  const fetchCategories = () => {
    api
      .get("/category")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to load categories"));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --------------------------- SAVE CATEGORY ---------------------------
  const handleSave = async (e: any) => {
    e.preventDefault();

    try {
      if (isEdit && editCategory) {
        await api.put(`/category/${editCategory._id}`, form);
        toast.success("Category updated successfully");
      } else {
        await api.post("/category", form);
        toast.success("Category added successfully");
      }

      closeModal();
      fetchCategories();
    } catch {
      toast.error("Failed to save");
    }
  };

  // --------------------------- DELETE CATEGORY -------------------------
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/category/${deleteId}`);
      toast.success("Deleted successfully");
      setDeleteModal(false);
      fetchCategories();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">All Categories</h2>

        <button
          onClick={() => {
            setIsEdit(false);
            setForm({ name: "" });
            openModal();
          }}
          className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle size={18} />
          Add Category
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-center">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200">
              <TableRow className="table-products">
                <TableCell isHeader>S.No</TableCell>
                <TableCell isHeader>Name</TableCell>
                <TableCell isHeader>Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.length > 0 ? (
                categories.map((item, index) => (
                  <TableRow key={item._id} className="table-products">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>

                    <TableCell className="flex gap-3 justify-center">
                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setIsEdit(true);
                          setEditCategory(item);
                          setForm({ name: item.name });
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
                <TableRow>
                  <TableCell className="text-center py-4 text-gray-500">
                    No Categories Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* -------------------------- ADD / EDIT MODAL ----------------------------- */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="bg-white p-6 rounded-2xl">
          <h4 className="text-xl font-semibold mb-4">
            {isEdit ? "Edit Category" : "Add Category"}
          </h4>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <Label>Category Name</Label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-sm"
                type="submit"
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
          <h4 className="text-xl font-semibold mb-2">Delete Category?</h4>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this category?
          </p>

          <div className="flex justify-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>

            <Button size="sm" className="bg-red-600" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
