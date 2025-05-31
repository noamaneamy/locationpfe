<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rent;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RentController extends Controller
{
    // Get all rents
    public function index()
    {
        $rents = Rent::all();
        return response()->json(['success' => true, 'data' => $rents]);
    }

    // Create a new rent
    public function store(Request $request)
    {
        try {
            // Validate request data
            $validatedData = $request->validate([
                'rental_date' => 'required|date',
                'return_date' => 'required|date|after:rental_date',
                'price' => 'required|numeric',
                'user_id' => 'required|exists:users,id',
                'car_id' => 'required|exists:cars,id'
            ]);

            // Check if car is available
            $car = DB::table('cars')->where('id', $request->car_id)->first();
            if (!$car || !$car->available) {
                return response()->json([
                    'success' => false,
                    'message' => 'Car is not available for rent'
                ], 400);
            }

            // Create the rental
            $rent = DB::table('rentals')->insert([
                'rental_date' => $request->rental_date,
                'return_date' => $request->return_date,
                'price' => $request->price,
                'user_id' => $request->user_id,
                'car_id' => $request->car_id
            ]);

            // Update car availability
            DB::table('cars')
                ->where('id', $request->car_id)
                ->update(['available' => false]);

            return response()->json([
                'success' => true,
                'message' => 'Rental created successfully',
                'data' => $rent
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating rental: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get rents of a specific user
    public function getUserRents($user_id)
    {
        //$rents = Rent::where('user_id', $user_id)->get();
        $user = User::with('rents.car')->find($user_id);
        $rents = $user->rents;

        return response()->json(['success' => true, 'data' => $rents]);
    }

    public function update(Request $request, $id)
    {
        $rent = Rent::findOrFail($id);

        $validatedData = $request->validate([
            'rental_date' => 'required',
            'return_date' => 'required',
            'price' => 'required',
            'user_id' => 'required',
            'car_id' => 'required',
        ]);

        DB::table('rentals')->where('id', $id)->update([
            'rental_date' => $request->rental_date,
            'return_date' => $request->return_date,
            'price' => $request->price,
            'user_id' => $request->user_id,
            'car_id' => $request->car_id
        ]);

        return response()->json([
            'data' => $rent,
            'message' => 'Rent updated successfully',
        ]);
    }

    public function destroy($id)
    {
        $rent = Rent::find($id);

        if (!$rent) {
            return response()->json(['success' => false, 'message' => 'Rent not found'], 404);
        }

        $rent->delete();

        return response()->json(['success' => true, 'message' => 'Rent deleted successfully']);
    }
}
