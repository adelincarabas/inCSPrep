using System;
using Npgsql;
using System.IO;

class Program
{
    static void Main()
    {
        string connectionString = File.ReadAllText("dbcredentials.txt");

        using var connection = new NpgsqlConnection(connectionString);
        connection.Open();

        string sql = "SELECT * FROM public.\"testTable\"";
        using var command = new NpgsqlCommand(sql, connection);

        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            int id = reader.GetInt32(0);
            Console.WriteLine($"ID: {id}");
        }
    }
}