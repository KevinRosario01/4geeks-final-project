import React from "react";

export default function Header({ user, handleLogout, openLoginModal, openSignUpModal }) {
  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <a href="#" className="text-2xl font-bold">
          RateMyProfessor
        </a>
        <div className="flex space-x-4">
          {user ? (
            <>
              <span>Welcome, {user.first_name}</span>
              {user.role === 'admin' && (
                <a href="/admin" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                  Admin Menu
                </a>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={openSignUpModal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
