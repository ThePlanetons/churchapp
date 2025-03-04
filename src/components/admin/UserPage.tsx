import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PenSquare } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import DynamicFormField from "./member/dynamic-form-field.tsx";

interface Member {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  phone: string;
  gender: string;
}

interface FormData {
  checked: boolean;
  description: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  rowIndex: number;
  type: string;
  variant: string;
}

const MemberCard: React.FC<{ member: Member }> = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updatedMember, setUpdatedMember] = useState<Member>({ ...member });

  const handleEditClick = () => setEditMode(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setUpdatedMember({ ...updatedMember, [name]: value });
  };

  const handleEditSave = () => {
    axios.put(`http://127.0.0.1:8000/api/member/${member.id}/update/`, updatedMember)
      .then(() => {
        setEditMode(false);
        setIsHovered(false);
      })
      .catch((error) => console.error('Error updating member:', error));
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setUpdatedMember({ ...member });
  };

  return (
    <div
      className={`flex items-center px-6 py-4 border-b last:border-b-0 cursor-pointer relative ${isHovered ? 'hover:bg-gray-300' : ''}`}
      onClick={() => setIsHovered(!isHovered)}
    >
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-4">
        {member.first_name?.charAt(0) || 'A'}
      </div>
      <div className="flex-1">
        {editMode ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" name="first_name" value={updatedMember.first_name} className="border rounded px-2 py-1 mr-2" onChange={handleInputChange} />
            <input type="text" name="last_name" value={updatedMember.last_name} className="border rounded px-2 py-1 mr-2" onChange={handleInputChange} />
            <input type="email" name="email" value={updatedMember.email} className="border rounded px-2 py-1 mr-2" onChange={handleInputChange} />
            <input type="date" name="date_of_birth" value={updatedMember.date_of_birth} className="border rounded px-2 py-1 mr-2" onChange={handleInputChange} />
            <input type="tel" name="phone" value={updatedMember.phone} className="border rounded px-2 py-1 mr-2" onChange={handleInputChange} />
            <select name="gender" value={updatedMember.gender} className="border rounded px-2 py-1 mr-2" onChange={handleInputChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <button type="button" className="px-4 py-1 mx-1 bg-amber-200 rounded" onClick={handleEditSave}>Save</button>
            <button type="button" className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded" onClick={handleEditCancel}>Cancel</button>
          </form>
        ) : (
          <>
            <h4 className="text-sm font-medium">{member.first_name}</h4>
            <p className="text-sm text-gray-500">{member.email}</p>
          </>
        )}
      </div>
      {isHovered && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button className="px-5 py-3 my-2 bg-amber-200 text-bg-amber-900 rounded" onClick={handleEditClick}>Edit</button>
          <button className="px-3 py-3 my-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      )}
    </div>
  );
};

const UsersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [newMember, setNewMember] = useState<Member>({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    phone: '',
    gender: '',
  });
  const [dynamicFields, setDynamicFields] = useState<FormData[]>([]);
  const [dynamicPayload, setDynamicPayload] = useState<any[]>([]);
  const [formStatus, setFormStatus] = useState<{ success: string | null; error: string | null }>({ success: null, error: null });

  const receiveDataFromChild = (data: FormData) => {
    setDynamicFields((prevFields) => [...prevFields, data]);
    setDynamicPayload((prevFields) => [...prevFields, { dynamic_input: data }]);
  };

  const formSchema = z.object(
    dynamicFields.reduce<Record<string, z.ZodType>>((schema, field) => {
      if (field.required) {
        schema[field.name] =
          field.variant === "Checkbox"
            ? z.boolean().refine((val) => val === true, { message: `${field.label} must be checked.` })
            : z.string().nonempty(`${field.label} is required.`);
      } else {
        schema[field.name] = field.variant === "Checkbox" ? z.boolean().optional() : z.string().optional();
      }
      return schema;
    }, {})
  );

  const defaultValues = dynamicFields.reduce<Record<string, any>>((values, field) => {
    values[field.name] = field.variant === "Checkbox" ? false : "";
    return values;
  }, {});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    axios.get('http://127.0.0.1:8000/api/member/list/')
      .then((response) => setMembers(response.data))
      .catch((error) => console.error('Error fetching members:', error));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setFormStatus({
        success: 'Member added successfully!',
        error: null,
      });

      setNewMember({
        first_name: '',
        last_name: '',
        email: '',
        date_of_birth: '',
        phone: '',
        gender: '',
      });

      // Refresh member list after adding a member
      fetchMembers();
    } catch (error) {
      setFormStatus({
        success: null,
        error: 'There was an error adding the member. Please try again.',
      });
      console.error('Error adding member:', error);
    }
  };

  const handleConfigSubmit = async () => {
    const apiUrl = "http://127.0.0.1:8000/api/member/config/list/";
    const accessToken = localStorage.getItem("access_token");

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const payload = {
      data: dynamicPayload,
    };

    try {
      const response = await axios.post(apiUrl, payload, config);
      console.log("Response:", response.data);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white shadow-md sticky top-0">
          <h3 className="text-base sm:text-lg lg:text-xl font-medium">{showAddMember ? 'Add Member' : showConfig ? 'Config Form' : 'Member List'}</h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 sm:px-4 py-2 bg-amber-200 text-amber-900 rounded-lg" onClick={() => setShowAddMember(!showAddMember)}>
              <PenSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {showAddMember ? 'Close' : 'Add Member'}
            </button>
            {showAddMember && (
              <button className="flex items-center px-3 sm:px-4 py-2 bg-blue-200 text-blue-900 rounded-lg" onClick={() => setShowConfig(true)}>
                Config
              </button>
            )}
            {showConfig && (
              <button className="flex items-center px-3 sm:px-4 py-2 bg-gray-300 text-gray-700 rounded-lg" onClick={() => setShowConfig(false)}>
                Close
              </button>
            )}
          </div>
        </div>
        <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
          {showConfig ? (
            <div>
              <DynamicFormField onSave={receiveDataFromChild} />
              {dynamicFields.length > 0 && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleConfigSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                    {dynamicFields.map((field, index) => (
                      <FormField
                        key={index}
                        control={form.control}
                        name={field.name || `field_${index}`}
                        render={({ field: rhfField }) => (
                          <FormItem className={field.variant === "Checkbox" ? "flex flex-row items-center space-x-3 p-4 border rounded-md" : "space-y-2"}>
                            {field.variant === "Checkbox" ? (
                              <>
                                <FormControl>
                                  <Checkbox checked={rhfField.value} onCheckedChange={rhfField.onChange} />
                                </FormControl>
                                <div className="flex flex-col">
                                  <FormLabel>{field.label}</FormLabel>
                                  <FormDescription>{field.description}</FormDescription>
                                </div>
                              </>
                            ) : (
                              <>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                  <Input placeholder={field.placeholder} type={field.type || "text"} {...rhfField} />
                                </FormControl>
                                {field.description && <FormDescription>{field.description}</FormDescription>}
                              </>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              )}
            </div>
          ) : showAddMember ? (
            <form onSubmit={handleAddMember} className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <input type="text" name="first_name" placeholder="First Name" value={newMember.first_name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="text" name="last_name" placeholder="Last Name" value={newMember.last_name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="email" name="email" placeholder="Email" value={newMember.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="date" name="date_of_birth" value={newMember.date_of_birth} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="tel" name="phone" placeholder="Phone" value={newMember.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required />
              <select name="gender" value={newMember.gender} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <button type="submit" className="w-full py-2 bg-amber-200 text-amber-900 rounded-lg">Submit</button>
            </form>
          ) : (
            members.map((member, index) => <MemberCard key={index} member={member} />)
          )}
          {formStatus.success && <p className="text-green-500 mt-2">{formStatus.success}</p>}
          {formStatus.error && <p className="text-red-500 mt-2">{formStatus.error}</p>}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
