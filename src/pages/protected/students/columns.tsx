import { Copy, Edit, Eye, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/table/columnHeader"
import { FilterColumn } from "@/components/table/advanceFilter"
import { Link } from "react-router"
import { toast } from "sonner"

export interface StudentBase {
    id: string;
    college_id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    registration_number: string;
    aadhar_number: string;
    father_name: string;
    mother_name: string;
    religion: string;
    caste: string;
    email: string;
    phone_number: string;
    date_of_birth: Date;
    gender: string;
    batch_id: string;
    degree_id: string;
    department_id: string;
    year_of_passing: string;
    created_at: Date;
    updated_at: Date;
}

export interface StudentResponse {
    items: StudentBase[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

type ExtendedColumnDef<T> = ColumnDef<T> & {
    title?: string;
}


export const columns: ExtendedColumnDef<StudentBase>[] = [
    {
        accessorKey: 'first_name',
        title: 'First Name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="First Name" />
        ),
    },
    {
        accessorKey: 'middle_name',
        title: 'Middle Name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Middle Name" />
        ),
    },
    {
        accessorKey: 'last_name',
        title: 'Last Name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" />
        ),
    },
    {
        accessorKey: 'registration_number',
        title: 'Registration Number',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Registration Number" />
        ),
    },
    {
        accessorKey: 'aadhar_number',
        title: 'Aadhar Number',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Aadhar Number" />
        ),
    },
    {
        accessorKey: 'father_name',
        title: 'Father Name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Father Name" />
        ),
    },
    {
        accessorKey: 'mother_name',
        title: 'Mother Name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Mother Name" />
        ),
    },
    {
        accessorKey: 'religion',
        title: 'Religion',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Religion" />
        ),
    },
    {
        accessorKey: 'caste',
        title: 'Caste',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Caste" />
        ),
    },
    {
        accessorKey: 'email',
        title: 'Email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: 'phone_number',
        title: 'Phone Number',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone Number" />
        ),
    },
    {
        accessorKey: 'date_of_birth',
        title: 'Date of Birth',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date of Birth" />
        ),
    },
    {
        accessorKey: 'gender',
        title: 'Gender',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Gender" />
        ),
    },
    {
        accessorKey: 'year_of_passing',
        title: 'Year of Passing',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Year of Passing" />
        ),
    },
    {
        accessorKey: 'created_at',
        title: 'Created At',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Created At" />
        ),
    },
    {
        accessorKey: 'updated_at',
        title: 'Updated At',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Updated At" />
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original
            const id = student.id
            return (
                <div className="text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-6 w-6 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={async () => {
                                    if (navigator.clipboard && navigator.clipboard.writeText) {
                                        await navigator.clipboard.writeText(student.registration_number)
                                        toast.success("Copied", {
                                            description: `Registration Number ${student.registration_number} has been copied at ${new Date().toLocaleTimeString()}`,
                                        })
                                    }
                                    else {
                                        toast.error("Copy failed", {
                                            description: "Your browser does not support clipboard API",
                                        })
                                    }
                                }
                                }
                            >
                                <Copy className="h-4 w-4" />
                                Copy Registration Number
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link to={`${id}`} className="w-full">
                                <DropdownMenuItem>
                                    <Eye className="h-4 w-4" />
                                    View
                                </DropdownMenuItem>
                            </Link>
                            <Link to={`edit/${id}`} className="w-full">
                                <DropdownMenuItem>
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
]

export const filterColumns: FilterColumn[] = [
    { name: 'first_name', label: 'First Name', type: 'string' },
    { name: 'middle_name', label: 'Middle Name', type: 'string' },
    { name: 'last_name', label: 'Last Name', type: 'string' },
    { name: 'registration_number', label: 'Registration Number', type: 'string' },
    { name: 'aadhar_number', label: 'Aadhar Number', type: 'string' },
    { name: 'father_name', label: 'Father Name', type: 'string' },
    { name: 'mother_name', label: 'Mother Name', type: 'string' },
    { name: 'religion', label: 'Religion', type: 'string' },
    { name: 'caste', label: 'Caste', type: 'string' },
    { name: 'email', label: 'Email', type: 'string' },
    { name: 'phone_number', label: 'Phone Number', type: 'string' },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
    { name: 'gender', label: 'Gender', type: 'string' },
    { name: 'year_of_passing', label: 'Year of Passing', type: 'string' },
    { name: 'created_at', label: 'Created At', type: 'date' },
    { name: 'updated_at', label: 'Updated At', type: 'date' },
];