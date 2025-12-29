'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    RectangleStackIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    PlusIcon,
    SparklesIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Ana Sayfa', href: '/', icon: HomeIcon },
    { name: 'Kategoriler', href: '/categories', icon: RectangleStackIcon },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <Disclosure as="nav" className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                {/* Logo */}
                                <Link href="/" className="flex items-center gap-2 group">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                                        <SparklesIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-lg font-bold hidden sm:block">
                                        <span className="gradient-text">Derdine</span>
                                        <span className="text-slate-400 font-normal ml-1">Forum</span>
                                    </span>
                                </Link>

                                {/* Desktop navigation */}
                                <div className="hidden md:block ml-8">
                                    <div className="flex items-center space-x-1">
                                        {navigation.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        isActive
                                                            ? 'bg-indigo-500/10 text-indigo-400'
                                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                                                        'rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 transition-all'
                                                    )}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center space-x-3">
                                {/* Search */}
                                <Link
                                    href="/search"
                                    className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                </Link>

                                {/* Create thread */}
                                <Link
                                    href="/create"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                                >
                                    <PlusIcon className="h-4 w-4" />
                                    <span className="hidden lg:inline">Yeni Konu</span>
                                </Link>

                                {/* Admin */}
                                <Link
                                    href="/admin"
                                    className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                                    title="Admin Panel"
                                >
                                    <Cog6ToothIcon className="h-5 w-5" />
                                </Link>

                                {/* Auth Buttons or Profile Menu */}
                                {user ? (
                                    <Menu as="div" className="relative">
                                        <Menu.Button className="flex items-center rounded-full p-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                                {user.avatarUrl ? (
                                                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="font-bold text-sm bg-gradient-to-br from-indigo-500 to-purple-500 w-full h-full flex items-center justify-center">
                                                        {user.username[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-slate-900 border border-slate-800 shadow-xl shadow-black/30 focus:outline-none overflow-hidden z-50">
                                                <div className="py-1">
                                                    <div className="px-4 py-2 border-b border-slate-800">
                                                        <p className="text-xs text-slate-400">Giriş yapıldı</p>
                                                        <p className="text-sm font-medium text-white truncate">{user.username}</p>
                                                    </div>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                href="/profile"
                                                                className={classNames(
                                                                    active ? 'bg-slate-800' : '',
                                                                    'flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300'
                                                                )}
                                                            >
                                                                <UserCircleIcon className="w-4 h-4" />
                                                                Profilim
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link
                                                                href="/settings"
                                                                className={classNames(
                                                                    active ? 'bg-slate-800' : '',
                                                                    'flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300'
                                                                )}
                                                            >
                                                                <Cog6ToothIcon className="w-4 h-4" />
                                                                Ayarlar
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <div className="border-t border-slate-800 mt-1 pt-1">
                                                        <Menu.Item>
                                                            {({ active }) => (
                                                                <button
                                                                    onClick={logout}
                                                                    className={classNames(
                                                                        active ? 'bg-slate-800 text-rose-400' : 'text-slate-400',
                                                                        'flex w-full items-center gap-2 px-4 py-2.5 text-sm'
                                                                    )}
                                                                >
                                                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                                                    Çıkış Yap
                                                                </button>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="text-slate-300 hover:text-white text-sm font-medium px-3 py-2 transition-colors"
                                        >
                                            Giriş Yap
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-slate-700"
                                        >
                                            Kayıt Ol
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <div className="flex md:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
                                    {open ? (
                                        <XMarkIcon className="h-6 w-6" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" />
                                    )}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    <Disclosure.Panel className="md:hidden border-t border-slate-800">
                        <div className="space-y-1 px-4 py-4">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Disclosure.Button
                                        key={item.name}
                                        as={Link}
                                        href={item.href}
                                        className={classNames(
                                            isActive
                                                ? 'bg-indigo-500/10 text-indigo-400'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium'
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Disclosure.Button>
                                );
                            })}
                            <Disclosure.Button
                                as={Link}
                                href="/search"
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-300 hover:bg-slate-800"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5" />
                                Ara
                            </Disclosure.Button>
                            <Link
                                href="/create"
                                className="flex items-center justify-center gap-2 mt-2 w-full rounded-lg px-3 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Yeni Konu Oluştur
                            </Link>
                            {user ? (
                                <>
                                    <div className="px-4 py-2 border-t border-slate-800 mt-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-base font-medium text-white">{user.username}</div>
                                                <div className="text-sm font-medium text-slate-500">{user.email || 'Üye'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                                    >
                                        <UserCircleIcon className="w-5 h-5" />
                                        Profilim
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                                    >
                                        <Cog6ToothIcon className="w-5 h-5" />
                                        Ayarlar
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white text-left"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        Çıkış Yap
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 px-3 py-3 border-t border-slate-800 mt-2">
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center rounded-lg px-3 py-2.5 text-base font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        Giriş Yap
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center justify-center rounded-lg px-3 py-2.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-colors"
                                    >
                                        Kayıt Ol
                                    </Link>
                                </div>
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
