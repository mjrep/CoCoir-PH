<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call our specific seeders
        $this->call([
            ProductSeeder::class,
        ]);

        // Demo users
        $users = [
            ['email' => 'buyer@cocoir.ph', 'password' => bcrypt('password'), 'name' => 'Juan dela Cruz', 'role' => 'buyer', 'mobile_number' => '09171234567', 'address' => '123 Aguinaldo St, Quezon City', 'profile_image' => ''],
            ['email' => 'seller@cocoir.ph', 'password' => bcrypt('password'), 'name' => 'Devign Seller', 'role' => 'seller', 'mobile_number' => '09281234567', 'address' => '456 Rizal Ave, Manila', 'profile_image' => ''],
        ];

        foreach ($users as $userData) {
            \App\Models\User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

    }
}
