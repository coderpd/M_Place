import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export const UserProfileCard = ({ user, onClose }) => {
  const getInitials = (name) => {
    if (!name) return "NA";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
        
        <CardHeader className="items-center pt-8 pb-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
            {getInitials(user.personName)}
          </div>
          <CardTitle className="text-2xl font-bold text-center">{user.personName || "N/A"}</CardTitle>
          <CardDescription className="text-lg text-gray-600 text-center">
            {user.companyName || "N/A"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 py-4 space-y-4">
          <div className="flex items-center space-x-4">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800">{user.Email || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-800">{user.phoneNumber || user.contactNumber || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-gray-800 font-medium">
                {user.status || 'Active'}
                <span className={`ml-2 inline-block w-2 h-2 rounded-full ${user.status === 'Inactive' ? 'bg-red-500' : 'bg-green-500'}`}></span>
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <Button 
            onClick={() => onClose(null)}
            className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};