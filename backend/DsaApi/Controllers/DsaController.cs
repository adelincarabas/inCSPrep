using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Collections.Generic;
using System.IO;

namespace DsaApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DsaController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<DsaExercise>> GetExercises()
        {
            var exercises = new List<DsaExercise>();
            string connectionString = System.IO.File.ReadAllText("../dbcredentials.txt");

            using var connection = new NpgsqlConnection(connectionString);
            connection.Open();

            string sql = "SELECT * FROM public.\"DSA_EXERCISES\"";
            using var command = new NpgsqlCommand(sql, connection);

            using var reader = command.ExecuteReader();
            while (reader.Read())
            {
                var exercise = new DsaExercise
                {
                    Id = reader.GetInt32(0),
                    TestCases = reader.GetString(1),
                    Title = reader.GetString(2),
                    Difficulty = reader.GetString(3),
                    Description = reader.GetString(4)
                };
                exercises.Add(exercise);
            }

            return Ok(exercises);
        }
    }
}