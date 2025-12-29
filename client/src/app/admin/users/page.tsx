'use client';

import { useState, useEffect } from 'react';
import { getUsers, deleteUser, User } from '@/lib/api';
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
            try {
                await deleteUser(id);
                loadUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Kullanıcılar</h1>

            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Kullanıcı</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Email</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Rozet</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Konular</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">Yanıtlar</th>
                            <th className="text-left px-5 py-3 text-sm font-medium text-gray-400">İtibar</th>
                            <th className="text-right px-5 py-3 text-sm font-medium text-gray-400">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="font-medium">{user.username}</span>
                                            {user.isOnline && (
                                                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-400 text-sm">{user.email || '-'}</td>
                                <td className="px-5 py-4">
                                    {user.badge ? (
                                        <span className="px-2 py-1 text-xs font-medium bg-indigo-600 text-white rounded">
                                            {user.badge}
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="px-5 py-4 text-sm">{user.threadCount}</td>
                                <td className="px-5 py-4 text-sm">{user.replyCount}</td>
                                <td className="px-5 py-4 text-sm">{user.reputation}</td>
                                <td className="px-5 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
