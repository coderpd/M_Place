"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export const UserProfileCard = ({ user, onClose }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm overflow-hidden">
        <div className=" h-2 w-full"></div>
        
        <CardHeader className="items-center pt-6 pb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-3">
            {getInitials(user.personName)}
          </div>
          <CardTitle className="text-xl font-bold text-center">{user.personName}</CardTitle>
          <p className="text-sm text-gray-500 text-center">{user.companyName}</p>
        </CardHeader>
        
        <CardContent className="px-6 py-4 space-y-4">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="text-gray-700">{user.Email}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span className="text-gray-700">{user.contactNumber}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-gray-700">Status: <span className="font-medium">{user.status || 'Active'}</span></span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <Button 
            onClick={onClose}
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};